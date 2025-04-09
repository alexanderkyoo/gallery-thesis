import pandas as pd
import psycopg2
import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

def connect():
    db_host = os.getenv('DB_HOST')
    db_name = os.getenv('DB_NAME')
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    
    conn_string = f"postgresql://{db_user}:{db_password}@{db_host}/{db_name}"
    engine = create_engine(conn_string)
    
    connection = psycopg2.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password,
        connect_timeout=10
    )

    return connection, engine

def clear_tables(table_name=None):
    conn, _ = connect()
    conn.autocommit = True
    cur = conn.cursor()
    
    if table_name:
        cur.execute(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;")
        print(f"Cleared table: {table_name}")
    else:
        cur.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public';
        """)
        tables = cur.fetchall()
        for (table,) in tables:
            cur.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;")
            print(f"Cleared table: {table}")
    
    cur.close()
    conn.close()

def populate_paintings():
    clear_tables("painting")
    df = pd.read_csv('data/WikiArt-info-truncated.tsv', sep='\t')
    conn, _ = connect()
    conn.autocommit = True
    cur = conn.cursor()
    
    df = df.rename(columns={
        'ID': 'name',
        'Category': 'category',
        'Artist': 'author',
        'Title': 'title',
        'Year': 'year',
        'Painting Info URL': 'info_url'
    })
    
    df = df[['name', 'title', 'author', 'info_url', 'year', 'category']]
    df['year'] = pd.to_numeric(df['year'], errors='coerce')
    
    inserted_count = 0
    for index, row in df.iterrows():
        cur.execute(
            """
            INSERT INTO painting 
            (name, title, author, info_url, year, category) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                row['name'], 
                row['title'], 
                row['author'], 
                row['info_url'], 
                None if pd.isna(row['year']) else int(row['year']), 
                row['category']
            )
        )
        inserted_count += 1
        if inserted_count % 100 == 0:
            print (str(inserted_count))
    
    cur.close()
    conn.close()
    
def populate_poems():
    clear_tables("poem")
    conn, _ = connect()
    conn.autocommit = True
    cur = conn.cursor()
    ep_df = pd.read_csv('data/EmotionPoetryData-indexed.csv')
    ep_df['name'] = ep_df['ID'].apply(lambda x: f"{x}_EP")
    ep_df = ep_df[['name']]

    inserted_count = 0
    for index, row in ep_df.iterrows():
        cur.execute(
            """
            INSERT INTO poem (name) 
            VALUES (%s)
            """, 
            (row['name'],)
        )
        inserted_count += 1
        if inserted_count % 200 == 0:
            print(f"EmotionPoetryData inserted: {inserted_count}")

    pf_df = pd.read_csv('data/poetry_truncated.csv')
    pf_df['name'] = pf_df['ID'].apply(lambda x: f"{x}_PF")
    pf_df = pf_df.rename(columns={'Poet': 'author', 'Title': 'title'})
    pf_df = pf_df[['name', 'title', 'author']]

    inserted_count = 0
    for index, row in pf_df.iterrows():
        cur.execute(
            """
            INSERT INTO poem (name, title, author) 
            VALUES (%s, %s, %s)
            """, 
            (row['name'], row['title'], row['author'])
        )
        inserted_count += 1
        if inserted_count % 500 == 0:
            print(f"PoetryTruncatedData inserted: {inserted_count}")

    cur.close()
    conn.close()

def populate_emotion_pairings():
    clear_tables("pairing")
    conn, _ = connect()
    conn.autocommit = True
    cur = conn.cursor()
    
    emotion_df = pd.read_csv('data/emotional_pairings.csv')
    
    emotion_df = emotion_df.rename(columns={
        'Art ID': 'painting_name',
        'Top Poem ID': 'poem_id',
        'Sim Score': 'similarity_score'
    })
    
    inserted_count = 0
    not_found_count = 0
    
    for index, row in emotion_df.iterrows():
        painting_name = row['painting_name']
        poem_id = row['poem_id']
        similarity_score = row['similarity_score']
        
        poem_name = f"{poem_id}_EP"
        
        cur.execute(
            """
            SELECT id FROM painting WHERE name = %s
            """,
            (painting_name,)
        )
        painting_result = cur.fetchone()
        
        cur.execute(
            """
            SELECT id FROM poem WHERE name = %s
            """,
            (poem_name,)
        )
        poem_result = cur.fetchone()
        
        if painting_result and poem_result:
            painting_id = painting_result[0]
            poem_id = poem_result[0]
            
            cur.execute(
                """
                INSERT INTO pairing (basis, painting_id, poem_id) 
                VALUES (%s, %s, %s)
                """,
                ("Emotion", painting_id, poem_id)
            )
            inserted_count += 1
            
            if inserted_count % 100 == 0:
                print(f"Emotion pairings inserted: {inserted_count}")
        else:
            not_found_count += 1
            if not painting_result:
                print(f"Warning: Painting not found: {painting_name}")
            if not poem_result:
                print(f"Warning: Poem not found: {poem_name}")
    
    print(f"Total emotion pairings inserted: {inserted_count}")
    print(f"Emotion pairings skipped (not found): {not_found_count}")
    
    cur.close()
    conn.close()

def populate_CLIP_pairings():
    conn, _ = connect()
    conn.autocommit = True
    cur = conn.cursor()
    
    clip_df = pd.read_csv('data/clip_pairings.csv')
    
    clip_df = clip_df.rename(columns={
        'Painting': 'painting_name',
        'Best Matching Poem Index': 'poem_id',
        'Similarity Score': 'similarity_score'
    })
    
    inserted_count = 0
    not_found_count = 0
    
    for index, row in clip_df.iterrows():
        painting_name = row['painting_name']
        # Strip the .jpg extension if present
        if painting_name.endswith('.jpg'):
            painting_name = painting_name[:-4]
        
        poem_id = row['poem_id']
        similarity_score = row['similarity_score']
        
        poem_name = f"{poem_id}_PF"
        
        cur.execute(
            """
            SELECT id FROM painting WHERE name = %s
            """,
            (painting_name,)
        )
        painting_result = cur.fetchone()
        
        cur.execute(
            """
            SELECT id FROM poem WHERE name = %s
            """,
            (poem_name,)
        )
        poem_result = cur.fetchone()
        
        if painting_result and poem_result:
            painting_id = painting_result[0]
            poem_id = poem_result[0]
            
            cur.execute(
                """
                INSERT INTO pairing (basis, painting_id, poem_id) 
                VALUES (%s, %s, %s)
                """,
                ("CLIP", painting_id, poem_id)
            )
            inserted_count += 1
            
            if inserted_count % 100 == 0:
                print(f"CLIP pairings inserted: {inserted_count}")
        else:
            not_found_count += 1
            if not painting_result:
                print(f"Warning: Painting not found: {painting_name}")
            if not poem_result:
                print(f"Warning: Poem not found: {poem_name}")
    
    print(f"Total CLIP pairings inserted: {inserted_count}")
    print(f"CLIP pairings skipped (not found): {not_found_count}")
    
    cur.close()
    conn.close()
    
def populate_object_pairings():
    conn, _ = connect()
    conn.autocommit = True
    cur = conn.cursor()
    
    object_df = pd.read_csv('data/scoring_results.csv')
    
    object_df = object_df.rename(columns={
        'Painting': 'painting_name',
        'Best_Matching_Poem_ID': 'poem_id',
        'Score': 'score',
        'Matching_Objects': 'objects'
    })
    
    inserted_count = 0
    not_found_count = 0
    skipped_count = 0
    
    for index, row in object_df.iterrows():
        # Skip rows with empty poem IDs or score of 0
        if pd.isna(row['poem_id']) or row['score'] == 0.0:
            skipped_count += 1
            continue
            
        painting_name = row['painting_name']
        # Strip the .jpg extension if present
        if painting_name.endswith('.jpg'):
            painting_name = painting_name[:-4]
        
        poem_id = int(row['poem_id'])  # Convert to integer
        
        poem_name = f"{poem_id}_PF"
        
        cur.execute(
            """
            SELECT id FROM painting WHERE name = %s
            """,
            (painting_name,)
        )
        painting_result = cur.fetchone()
        
        cur.execute(
            """
            SELECT id FROM poem WHERE name = %s
            """,
            (poem_name,)
        )
        poem_result = cur.fetchone()
        
        if painting_result and poem_result:
            painting_id = painting_result[0]
            poem_id = poem_result[0]
            
            cur.execute(
                """
                INSERT INTO pairing (basis, painting_id, poem_id) 
                VALUES (%s, %s, %s)
                """,
                ("Object", painting_id, poem_id)
            )
            inserted_count += 1
            
            if inserted_count % 100 == 0:
                print(f"Object pairings inserted: {inserted_count}")
        else:
            not_found_count += 1
            if not painting_result:
                print(f"Warning: Painting not found: {painting_name}")
            if not poem_result:
                print(f"Warning: Poem not found: {poem_name}")
    
    print(f"Total object pairings inserted: {inserted_count}")
    print(f"Object pairings skipped (no matching poem or zero score): {skipped_count}")
    print(f"Object pairings skipped (not found in DB): {not_found_count}")
    
    cur.close()
    conn.close()


def count_rows(table_name):
    conn, _ = connect()
    cur = conn.cursor()
    cur.execute(f"SELECT COUNT(*) FROM {table_name};")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

    
if __name__ == "__main__":
    # print("Counting rows in 'painting' before clearing...")
    # before = count_rows("painting")
    # print(f"Rows before clearing: {before}")
    
    # clear_tables("painting")

    # print("Counting rows in 'painting' after clearing...")
    # after = count_rows("painting")
    # print(f"Rows after clearing: {after}")
    # populate_paintings()
    # populate_poems()
    # populate_emotion_pairings()
    # print(count_rows("pairing"))
    # populate_CLIP_pairings()
    # print(count_rows("pairing"))
    # populate_object_pairings()
    print(count_rows("pairing"))