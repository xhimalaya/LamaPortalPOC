services:
  ridam_api:
    build: ./api
    container_name: ridam_api
    ports:
      - "8000:8000"
    volumes:
      - ./cube_storage:/cube_storage
      - ./satellite_data:/satellite_data