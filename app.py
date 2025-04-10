from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import boto3
import os
import psycopg2
from dotenv import load_dotenv
import base64
from functools import lru_cache
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

s3_url_cache = {}

def init_s3():
    s3 = boto3.client(
        's3',
        region_name=os.getenv('AWS_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    s3.list_buckets()
    return s3

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        connect_timeout=5
    )
    return conn

def get_painting_image(painting_name):
    if painting_name in s3_url_cache:
        url, expiry_time = s3_url_cache[painting_name]
        if datetime.now() < expiry_time:
            return url
    s3 = init_s3()
    bucket_name = os.getenv('S3_BUCKET')
    painting_key = f"downloaded_paintings/{painting_name}.jpg"

    try:
        s3.head_object(Bucket=bucket_name, Key=painting_key)

        image_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': painting_key},
            ExpiresIn=3600
        )
        expiry = datetime.now() + timedelta(hours=1)
        s3_url_cache[painting_name] = (image_url, expiry)
        
        return image_url
    except Exception as e:
        print(f"Error retrieving painting image: {str(e)}")

def get_painting(row_number=1):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, name, title, author, year, category, info_url 
            FROM painting 
            ORDER BY id
            LIMIT 1 OFFSET %s
        """, (row_number - 1,))

        painting = cur.fetchone()
        if not painting:
            cur.close()
            conn.close()
            return None
        
        painting_id = painting[0]
        painting_data = {
            'id': painting_id,
            'name': painting[1],
            'title': painting[2],
            'author': painting[3],
            'year': painting[4],
            'category': painting[5],
            'info_url': painting[6]
        }
        
        cur.execute("""
            SELECT p.id, p.painting_id, p.poem_id, p.basis,
                  po.name AS poem_name
            FROM pairing p
            JOIN poem po ON p.poem_id = po.id
            WHERE p.painting_id = %s
        """, (painting_id,))
        
        pairings = cur.fetchall()
        if pairings:
            painting_data['pairings'] = []
            for pairing in pairings:
                pairing_data = {
                    'id': pairing[0],
                    'basis': pairing[3],
                    'poem': {
                        'id': pairing[2],
                        'name': pairing[4]
                    }
                }
                painting_data['pairings'].append(pairing_data)
        
        cur.close()
        conn.close()
        
        return painting_data
    except Exception as e:
        print(f"Error retrieving painting: {str(e)}")
        if conn:
            conn.close()
        return None

@lru_cache(maxsize=200)
def get_poem_content(poem_name):
    s3 = init_s3()
    if not s3:
        return None
    bucket_name = os.getenv('S3_BUCKET')
    poem_key = f"downloaded_poems/{poem_name}.txt"

    try:
        response = s3.get_object(Bucket=bucket_name, Key=poem_key)
        poem_content = response['Body'].read().decode('utf-8')
        return poem_content
    except Exception as e:
        print(f"Error retrieving poem content: {str(e)}")
        return None

@app.get("/api/index")
async def populate_index(page: int = Query(1, ge=1), limit: int = Query(2000, ge=1, le=2000)):
    conn = get_db_connection()
    if not conn:
        return JSONResponse(
            status_code=500, 
            content={"message": "Could not connect to database"}
        )
    try:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM painting")
        total_count = cur.fetchone()[0]
        offset = (page - 1) * limit
        cur.execute("""
            SELECT id, name, title, author, year, category
            FROM painting
            ORDER BY id
            LIMIT %s OFFSET %s
        """, (limit, offset))
        paintings = cur.fetchall()
        cur.close()
        conn.close()
        
        results = []
        
        for painting in paintings:
            painting_id = painting[0]
            painting_name = painting[1]
            
            image_url = get_painting_image(painting_name)
            painting_data = {
                'id': painting_id,
                'name': painting_name,
                'title': painting[2],
                'author': painting[3],
                'year': painting[4],
                'category': painting[5],
                'image_url': image_url
            }
            
            results.append(painting_data)
        total_pages = (total_count + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        return JSONResponse(content={
            "paintings": results,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "total_pages": total_pages,
                "has_next": has_next,
                "has_prev": has_prev
            }
        })
    
    except Exception as e:
        print(f"Error retrieving painting index: {str(e)}")
        if conn:
            conn.close()
        return JSONResponse(
            status_code=500, 
            content={"message": f"An error occurred: {str(e)}"}
        )

@app.get("/api/painting/{row_number}")
async def get_painting_api(row_number: int):
    painting = get_painting(row_number)
    if painting:
        image_url = get_painting_image(painting['name']) if painting else None
        
        if 'pairings' in painting and painting['pairings']:
            for pairing in painting['pairings']:
                poem_content = get_poem_content(pairing['poem']['name'])
                if poem_content:
                    pairing['poem']['content'] = poem_content
        
        return JSONResponse(content={"painting": painting, "image_url": image_url})
    return JSONResponse(status_code=404, content={"message": "Painting not found"})
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)