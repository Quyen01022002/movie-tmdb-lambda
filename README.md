## 📊 Streamify Pipeline Architecture

```mermaid
flowchart TD

    %% ========== Sources ==========
    subgraph Sources["📂 Data Sources"]
        CSV["CSV Files"]
        XML["XML Files"]
        TMDB["TMDB API"]
    end

    %% ========== Raw Ingest Lambdas ==========
    subgraph Ingest["⚡ Ingest Lambdas"]
        CSVL["CSV Lambda"]
        XMLL["XML Lambda"]
        TMDBL["movie-tmdb-lambda"]
    end

    CSV --> CSVL
    XML --> XMLL
    TMDB --> TMDBL

    %% ========== Raw Topic ==========
    CSVL --> RawTopic["movies_raw_topic"]
    XMLL --> RawTopic
    TMDBL --> RawTopic

    %% ========== Validation Layer ==========
    RawTopic --> Validation["Validation Lambda"]
    Validation -->|Valid| Topic["validated_topic"]
    Validation -->|Invalid| DLQ["❌ Dead Letter Queue"]

    %% ========== Enrichment Layer ==========
    Topic --> Normalize["Normalize Movie Lambda"]
    Normalize --> Merge["merge-movie-translations-lambda"]
    Merge --> MapGenre["map-genre-names-lambda"]

    %% ========== Load Layer ==========
    MapGenre --> Load["Load Lambda"]

    %% ========== Storage ==========
    subgraph Storage["🗄️ Storage"]
        Mongo["MongoDB\n(Metadata + Relations)"]
        ES["Elasticsearch\n(Search Index)"]
    end

    Load --> Mongo
    Load --> ES

    %% ========== API Services ==========
    subgraph Services["🛠️ Services"]
        Catalog["Catalog Service (Movies/Genres/People)"]
        Search["Search Service"]
        UserAPI["User API / Auth"]
    end

    Mongo --> Catalog
    ES --> Search

    Catalog --> Web
    Catalog --> Mobile
    Search --> Web
    Search --> Mobile
    UserAPI --> Web
    UserAPI --> Mobile

    %% ========== Client ==========
    subgraph Client["📱 Client"]
        Web["Web UI"]
        Mobile["Mobile App"]
    end

    %% ========== Optional Streaming ==========
    subgraph Streaming["🎥 Media Pipeline (Optional)"]
        S3["S3 (Raw Video)"]
        MediaConvert["AWS MediaConvert"]
        CDN["CDN (CloudFront)"]
    end

    S3 --> MediaConvert --> CDN --> Web
    S3 --> MediaConvert --> CDN --> Mobile

    %% ========== Styling ==========
    style TMDBL fill="#f9c74f",stroke="#000"
