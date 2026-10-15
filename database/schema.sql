-- =====================================================================
-- 알래스카인디고 스타일 인쇄 특화 SI 솔루션 통합 DB 스키마 (PostgreSQL)
-- =====================================================================

-- 1. 인쇄 품목 및 기본 규격 마스터 테이블
CREATE TABLE print_products (
    product_id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL, -- 'DIGITAL_BOOK', 'OFFSET_FLYER', 'STICKER' 등
    product_name VARCHAR(100) NOT NULL, -- '무선제본 카탈로그', '합판 전단지'
    print_method VARCHAR(20) NOT NULL,  -- 'DIGITAL' (디지털), 'OFFSET' (옵셋/합판), 'DIRECT' (독판)
    base_lead_time INT DEFAULT 1        -- 기본 제작 소요일
);

-- 2. 규격(Size) 및 조판 걸이수(Imposition) 테이블
CREATE TABLE print_sizes (
    size_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES print_products(product_id),
    size_name VARCHAR(50) NOT NULL,     -- 'A4 (210x297)', 'B5 (182x257)', '명함 (90x50)'
    cut_width_mm NUMERIC(6,1) NOT NULL, -- 재단 가로(mm)
    cut_height_mm NUMERIC(6,1) NOT NULL,-- 재단 세로(mm)
    work_width_mm NUMERIC(6,1) NOT NULL,-- 작업 가로(여백 포함)
    work_height_mm NUMERIC(6,1) NOT NULL,
    imposition_count INT NOT NULL       -- 전지(국전지/46전지) 또는 디지털 원단 1장당 나오는 페이지/매수 (절수/걸이수)
);

-- 3. 용지(Paper) 및 지대 단가 마스터 테이블
CREATE TABLE print_papers (
    paper_id SERIAL PRIMARY KEY,
    paper_group VARCHAR(50) NOT NULL,   -- '일반지(아트/스노우)', '고급지(랑데뷰/아르떼)', '특수지'
    paper_name VARCHAR(50) NOT NULL,    -- '스노우화이트', '랑데뷰 내츄럴'
    grammage INT NOT NULL,              -- 평량 (100, 150, 250, 300 등 g/㎡)
    unit_cost_per_sheet NUMERIC(10,2) NOT NULL -- 기준 원단 1매당 단가 (원)
);

-- 4. 후가공(Post-Press) 단가 테이블
CREATE TABLE post_processes (
    process_id SERIAL PRIMARY KEY,
    process_type VARCHAR(50) NOT NULL,  -- 'COATING'(코팅), 'BINDING'(제본), 'FOIL'(박), 'CREASING'(오시)
    process_name VARCHAR(100) NOT NULL, -- '단면 무광코팅', '무선제본', '금박(100x50mm 이하)'
    base_setup_fee NUMERIC(10,0) DEFAULT 0, -- 기본 세팅비/동판비 (예: 박 동판비 30,000원)
    unit_price NUMERIC(10,2) NOT NULL,      -- 매당/부당 추가 단가
    min_charge NUMERIC(10,0) DEFAULT 0      -- 최소 공정 비용 (하한선)
);

-- 5. 합판(Gang-run) 전단지 및 명함 조견표 테이블
CREATE TABLE gangrun_price_matrix (
    matrix_id SERIAL PRIMARY KEY,
    product_type VARCHAR(30) NOT NULL, -- 'NAME_CARD'(명함), 'FLYER'(합판전단)
    paper_code VARCHAR(50) NOT NULL,   -- 'ART_100'(아트100g), 'SNOW_250'(스노우250g), 'BANNOU_300'(반누보300g)
    base_size_code VARCHAR(30) NOT NULL,-- 'A4', '16CUT'(16절), 'CARD_STD'(90x50)
    color_sides INT NOT NULL,          -- 4(단면칼라), 8(양면칼라)
    quantity_tier INT NOT NULL,        -- 명함: 200, 500, 1000매 / 전단: 1연(4000매 기준), 2연, 5연 등
    base_supply_price NUMERIC(10,0) NOT NULL -- 해당 구간의 기준 공급가 (원)
);

-- 6. 도무송/재단 스티커 면적(cm²) 및 원단별 단가 테이블
CREATE TABLE sticker_rate_rules (
    rule_id SERIAL PRIMARY KEY,
    material_code VARCHAR(50) NOT NULL, -- 'ART_90'(아트지코팅), 'YUPO_80'(유포지/방수), 'PET_CLEAR'(투명데드롱)
    shape_type VARCHAR(20) NOT NULL,    -- 'RECT'(사각재단), 'DOMUSONG'(자유형 도무송 칼선)
    price_per_sq_cm NUMERIC(8,4) NOT NULL, -- 1cm² 당 기준 원단+인쇄 단가
    die_cut_base_fee NUMERIC(10,0) DEFAULT 15000, -- 도무송 목형(칼판) 기본 세팅비
    min_order_price NUMERIC(10,0) DEFAULT 12000   -- 최소 주문 금액
);

-- 7. 주문 및 인쇄 공정(MES/ERP 연동) 테이블
CREATE TABLE print_orders (
    order_id VARCHAR(32) PRIMARY KEY,   -- 'ORD-20261015-0001'
    user_id INT NOT NULL,
    product_id INT REFERENCES print_products(product_id),
    spec_snapshot JSONB NOT NULL,       -- 주문 시점의 선택 옵션 전체 스냅샷
    price_breakdown JSONB NOT NULL,     -- 단가 산출 근거 상세
    total_supply_price NUMERIC(12,0) NOT NULL,
    total_vat NUMERIC(12,0) NOT NULL,
    original_file_url TEXT,             -- 고객 업로드 원본 파일 S3 경로
    print_ready_pdf_url TEXT,           -- 검수 완료 후 출력실로 넘길 최종 PDF 경로
    process_status VARCHAR(30) DEFAULT 'FILE_WAITING', 
    reject_reason TEXT,                 -- 파일 오류 시 사유
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
