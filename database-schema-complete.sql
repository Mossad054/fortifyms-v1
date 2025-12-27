-- ============================================================================
-- FORTIFY MIS - COMPLETE DATABASE SCHEMA
-- Production-Ready PostgreSQL Schema
-- Generated: 2025-12-28
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MODULE 1: USER & IDENTITY MANAGEMENT
-- ============================================================================

-- User roles enumeration
CREATE TYPE user_role AS ENUM (
    'MILL_OPERATOR',
    'MILL_TECHNICIAN', 
    'MILL_MANAGER',
    'FWGA_INSPECTOR',
    'FWGA_PROGRAM_MANAGER',
    'INSTITUTIONAL_BUYER',
    'LOGISTICS_PLANNER',
    'SYSTEM_ADMIN'
);

-- Core users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    image TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'MILL_OPERATOR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified TIMESTAMP,
    mill_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_mill_id ON users(mill_id);

-- User profiles
CREATE TABLE user_profiles (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    department VARCHAR(100),
    position VARCHAR(100),
    employee_id VARCHAR(100),
    avatar TEXT,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- MODULE 2: ORGANIZATION & STAKEHOLDER MANAGEMENT
-- ============================================================================

-- Mills/Facilities
CREATE TABLE mills (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    registration_number VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    certification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    certification_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mills_code ON mills(code);
CREATE INDEX idx_mills_country ON mills(country);
CREATE INDEX idx_mills_certification_status ON mills(certification_status);

-- Buyer profiles (Institutional buyers)
CREATE TABLE buyer_profiles (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    registration_id VARCHAR(100),
    primary_contact_name VARCHAR(255) NOT NULL,
    primary_contact_title VARCHAR(100),
    primary_contact_phone VARCHAR(50),
    primary_contact_email VARCHAR(255),
    billing_address JSONB,
    delivery_addresses JSONB,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verified_at TIMESTAMP,
    verified_by VARCHAR(255),
    average_order_volume DECIMAL(15,2),
    delivery_frequency VARCHAR(50),
    quality_specs JSONB,
    budget_constraints JSONB,
    preferred_payment_terms VARCHAR(50),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    rating DECIMAL(3,2),
    total_orders INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Buyer documents
CREATE TABLE buyer_documents (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    buyer_id VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMP,
    verified_by VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles(id) ON DELETE CASCADE
);

-- ============================================================================
-- MODULE 3: TRAINING & CAPACITY BUILDING
-- ============================================================================

-- Training courses
CREATE TABLE training_courses (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Training modules
CREATE TABLE training_modules (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    course_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    "order" INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE
);

-- Quizzes
CREATE TABLE quizzes (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    module_id VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    options TEXT,
    correct_answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (module_id) REFERENCES training_modules(id) ON DELETE CASCADE
);

-- Training progress tracking
CREATE TABLE training_progress (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
    progress DECIMAL(5,2) NOT NULL DEFAULT 0,
    score DECIMAL(5,2),
    certificate_id VARCHAR(255),
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
);

-- Training certificates
CREATE TABLE training_certificates (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    certificate_id VARCHAR(255) UNIQUE NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP,
    certificate_url TEXT,
    verification_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Diagnostic questionnaires
CREATE TABLE diagnostic_questionnaires (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    questions JSONB NOT NULL,
    branching_logic JSONB,
    problem_mapping JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Diagnostic results
CREATE TABLE diagnostic_results (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    questionnaire_id VARCHAR(255),
    responses JSONB NOT NULL,
    result TEXT NOT NULL,
    recommendations JSONB,
    severity VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    progress DECIMAL(5,2) NOT NULL DEFAULT 0,
    current_step INTEGER NOT NULL DEFAULT 0,
    total_steps INTEGER,
    flagged_issues JSONB,
    completion_actions JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES diagnostic_questionnaires(id)
);

-- Training alerts
CREATE TABLE training_alerts (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    trigger_condition TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recommended_action TEXT,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    scheduled_for TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Interactive simulations
CREATE TABLE interactive_simulations (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Guided walkthroughs
CREATE TABLE guided_walkthroughs (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    steps JSONB NOT NULL,
    overlay_config JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MODULE 4: COMPLIANCE & CERTIFICATION
-- ============================================================================

-- Compliance templates
CREATE TABLE compliance_templates (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    region VARCHAR(100),
    standard_reference VARCHAR(255),
    certification_type VARCHAR(50) NOT NULL DEFAULT 'INITIAL',
    sections JSONB NOT NULL,
    scoring_rules JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Compliance audits
CREATE TABLE compliance_audits (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    mill_id VARCHAR(255) NOT NULL,
    template_id VARCHAR(255) NOT NULL,
    auditor_id VARCHAR(255),
    audit_date TIMESTAMP NOT NULL,
    audit_type VARCHAR(50) NOT NULL DEFAULT 'SELF_AUDIT',
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    score DECIMAL(5,2),
    section_scores JSONB,
    responses JSONB NOT NULL,
    evidence JSONB,
    notes TEXT,
    flagged_issues JSONB,
    corrective_actions JSONB,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(255),
    review_comments TEXT,
    approval_status VARCHAR(50),
    certificate_issued BOOLEAN NOT NULL DEFAULT false,
    certificate_url TEXT,
    batch_period VARCHAR(100),
    submitted_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES compliance_templates(id),
    FOREIGN KEY (auditor_id) REFERENCES users(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE INDEX idx_compliance_audits_mill ON compliance_audits(mill_id);
CREATE INDEX idx_compliance_audits_status ON compliance_audits(status);
CREATE INDEX idx_compliance_audits_audit_date ON compliance_audits(audit_date);

-- Compliance annotations
CREATE TABLE compliance_annotations (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    audit_id VARCHAR(255) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    annotator_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    position JSONB NOT NULL,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (audit_id) REFERENCES compliance_audits(id) ON DELETE CASCADE,
    FOREIGN KEY (annotator_id) REFERENCES users(id)
);

-- Compliance suggestions
CREATE TABLE compliance_suggestions (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    template_id VARCHAR(255),
    condition JSONB NOT NULL,
    suggestion TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    estimated_effort VARCHAR(50),
    estimated_impact VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Compliance reports
CREATE TABLE compliance_reports (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    audit_id VARCHAR(255) UNIQUE NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    format VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    file_path TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    generated_by VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    downloaded_at TIMESTAMP,
    download_count INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- MODULE 5: PRODUCTION & BATCH MANAGEMENT
-- ============================================================================

-- Batch logs (production records)
CREATE TABLE batch_logs (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    mill_id VARCHAR(255) NOT NULL,
    operator_id VARCHAR(255) NOT NULL,
    batch_id VARCHAR(255) UNIQUE NOT NULL,
    production_line VARCHAR(100) NOT NULL,
    shift VARCHAR(50),
    batch_date_time TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Crop & Product
    crop_type VARCHAR(100) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    grade VARCHAR(100),
    raw_material_lot VARCHAR(100),
    raw_material_source VARCHAR(255),
    
    -- Production Volume
    input_weight DECIMAL(15,2) NOT NULL,
    expected_output_weight DECIMAL(15,2),
    output_weight DECIMAL(15,2),
    yield_percentage DECIMAL(5,2),
    
    -- Fortification
    premix_type VARCHAR(100),
    premix_batch_number VARCHAR(100),
    premix_manufacturer VARCHAR(255),
    premix_expiry_date TIMESTAMP,
    target_fortification JSONB,
    dosing_rate DECIMAL(10,4),
    expected_premix DECIMAL(15,2),
    actual_premix_used DECIMAL(15,2),
    variance DECIMAL(10,2),
    variance_explanation TEXT,
    
    -- Equipment
    doser_id VARCHAR(255),
    doser_settings JSONB,
    mixer_id VARCHAR(255),
    mixing_time DECIMAL(10,2),
    mixer_speed DECIMAL(10,2),
    process_parameters JSONB,
    
    -- Storage
    storage_location VARCHAR(255),
    packaging_date TIMESTAMP,
    packaging_type VARCHAR(100),
    number_of_units INTEGER,
    
    -- QC & Status
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    qc_status VARCHAR(50),
    quarantine_reason TEXT,
    release_date TIMESTAMP,
    released_by VARCHAR(255),
    
    -- Traceability
    qr_code_url TEXT,
    qr_code_generated BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

CREATE INDEX idx_batch_logs_mill ON batch_logs(mill_id);
CREATE INDEX idx_batch_logs_batch_id ON batch_logs(batch_id);
CREATE INDEX idx_batch_logs_status ON batch_logs(status);
CREATE INDEX idx_batch_logs_date ON batch_logs(batch_date_time);

-- QC Samples
CREATE TABLE qc_samples (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    batch_id VARCHAR(255) NOT NULL,
    sample_id VARCHAR(100),
    collection_point VARCHAR(100) NOT NULL,
    collection_time TIMESTAMP NOT NULL DEFAULT NOW(),
    sampled_by VARCHAR(255) NOT NULL,
    sample_quantity DECIMAL(10,2) NOT NULL,
    visual_inspection JSONB,
    photo_urls JSONB,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (batch_id) REFERENCES batch_logs(id) ON DELETE CASCADE
);

-- QC Tests
CREATE TABLE qc_tests (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    batch_id VARCHAR(255) NOT NULL,
    sample_id VARCHAR(255),
    tester_id VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_method VARCHAR(100),
    test_location VARCHAR(100),
    test_date TIMESTAMP NOT NULL DEFAULT NOW(),
    result DECIMAL(15,4),
    unit VARCHAR(50),
    target DECIMAL(15,4),
    tolerance DECIMAL(15,4),
    deviation DECIMAL(15,4),
    status VARCHAR(50) NOT NULL,
    lab_certificate VARCHAR(255),
    lab_report_url TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (batch_id) REFERENCES batch_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (sample_id) REFERENCES qc_samples(id),
    FOREIGN KEY (tester_id) REFERENCES users(id)
);

CREATE INDEX idx_qc_tests_batch ON qc_tests(batch_id);
CREATE INDEX idx_qc_tests_status ON qc_tests(status);

-- Corrective actions
CREATE TABLE corrective_actions (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    batch_id VARCHAR(255) NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    suspected_cause TEXT,
    evidence TEXT,
    verification TEXT,
    actions JSONB,
    responsible_person VARCHAR(255),
    due_date TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMP,
    completed_by VARCHAR(255),
    batch_disposition VARCHAR(100),
    disposition_reason TEXT,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    preventive_actions JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (batch_id) REFERENCES batch_logs(id) ON DELETE CASCADE
);

-- Traceability records
CREATE TABLE traceability_records (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    batch_id VARCHAR(255) NOT NULL,
    lot_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_location VARCHAR(255),
    event_time TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id VARCHAR(255),
    buyer_id VARCHAR(255),
    description TEXT,
    metadata JSONB,
    qr_code_data TEXT,
    verification_status VARCHAR(50),
    device_info TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (batch_id) REFERENCES batch_logs(id) ON DELETE CASCADE
);

CREATE INDEX idx_traceability_batch ON traceability_records(batch_id);
CREATE INDEX idx_traceability_event_type ON traceability_records(event_type);

-- ============================================================================
-- MODULE 6: EQUIPMENT & MAINTENANCE
-- ============================================================================

-- Equipment
CREATE TABLE equipment (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    mill_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    installation_date TIMESTAMP,
    location VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_calibration TIMESTAMP,
    next_calibration_due TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

CREATE INDEX idx_equipment_mill ON equipment(mill_id);
CREATE INDEX idx_equipment_type ON equipment(type);

-- Maintenance schedules
CREATE TABLE maintenance_schedules (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    equipment_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    frequency_days INTEGER,
    duration INTEGER,
    last_performed TIMESTAMP,
    next_due TIMESTAMP NOT NULL,
    assigned_to VARCHAR(255),
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    is_active BOOLEAN NOT NULL DEFAULT true,
    materials JSONB,
    instructions JSONB,
    tolerance_range JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

-- Maintenance tasks
CREATE TABLE maintenance_tasks (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    equipment_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255) NOT NULL,
    schedule_id VARCHAR(255),
    assigned_to VARCHAR(255) NOT NULL,
    created_by VARCHAR(255),
    alert_id VARCHAR(255),
    type VARCHAR(100) NOT NULL,
    frequency VARCHAR(50),
    scheduled_date TIMESTAMP NOT NULL DEFAULT NOW(),
    scheduled_time TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_date TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(255),
    description TEXT,
    estimated_duration INTEGER,
    pre_checklist JSONB,
    work_log JSONB,
    measurements JSONB,
    parts_replaced JSONB,
    issues JSONB,
    notes TEXT,
    evidence JSONB,
    calibration_data JSONB,
    result VARCHAR(50),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    cost DECIMAL(15,2),
    downtime INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES maintenance_schedules(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

CREATE INDEX idx_maintenance_tasks_equipment ON maintenance_tasks(equipment_id);
CREATE INDEX idx_maintenance_tasks_status ON maintenance_tasks(status);
CREATE INDEX idx_maintenance_tasks_scheduled_date ON maintenance_tasks(scheduled_date);

-- Maintenance alerts
CREATE TABLE maintenance_alerts (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    equipment_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    trigger_condition JSONB,
    recommended_action TEXT,
    sensor_data JSONB,
    threshold JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    acknowledged_by VARCHAR(255),
    acknowledged_at TIMESTAMP,
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP,
    resolution TEXT,
    task_id VARCHAR(255),
    response JSONB,
    metadata JSONB,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

-- Maintenance windows
CREATE TABLE maintenance_windows (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    mill_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    days_of_week JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

-- Periodic checks
CREATE TABLE periodic_checks (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    equipment_id VARCHAR(255) NOT NULL,
    check_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    result TEXT,
    notes TEXT,
    completed_at TIMESTAMP,
    completed_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, check_id)
);

-- ============================================================================
-- MODULE 7: PROCUREMENT & BIDDING
-- ============================================================================

-- RFPs (Request for Proposals)
CREATE TABLE rfps (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    buyer_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    total_volume DECIMAL(15,2) NOT NULL,
    unit_packaging VARCHAR(50) NOT NULL,
    number_of_units INTEGER,
    
    -- Quality specifications
    quality_specs JSONB,
    certification_required JSONB,
    dietary_requirements JSONB,
    
    -- Delivery requirements
    delivery_locations JSONB,
    delivery_schedule JSONB,
    delivery_conditions JSONB,
    
    -- Pricing & payment
    max_unit_price DECIMAL(15,2),
    total_budget DECIMAL(15,2),
    preferred_payment_terms VARCHAR(100),
    price_inclusions JSONB,
    
    -- Additional requirements
    packaging_labeling JSONB,
    documentation_required JSONB,
    sampling_requirements JSONB,
    
    -- Eligibility & selection
    geographic_restriction JSONB,
    mill_certification JSONB,
    capacity_requirement DECIMAL(15,2),
    track_record_requirement JSONB,
    evaluation_criteria JSONB,
    
    -- Timeline
    open_date TIMESTAMP NOT NULL DEFAULT NOW(),
    bid_deadline TIMESTAMP NOT NULL,
    estimated_award_date TIMESTAMP,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    visibility VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
    shortlisted_bids JSONB,
    awarded_bid_id VARCHAR(255),
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles(id)
);

CREATE INDEX idx_rfps_buyer ON rfps(buyer_id);
CREATE INDEX idx_rfps_status ON rfps(status);
CREATE INDEX idx_rfps_bid_deadline ON rfps(bid_deadline);

-- Bids
CREATE TABLE bids (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    rfp_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255) NOT NULL,
    
    -- Pricing
    unit_price DECIMAL(15,2) NOT NULL,
    total_product_cost DECIMAL(15,2) NOT NULL,
    delivery_cost DECIMAL(15,2),
    additional_costs DECIMAL(15,2),
    total_bid_amount DECIMAL(15,2) NOT NULL,
    price_validity INTEGER NOT NULL,
    payment_terms VARCHAR(100),
    
    -- Delivery proposal
    delivery_schedule JSONB,
    lead_time INTEGER,
    delivery_method VARCHAR(100),
    vehicle_type VARCHAR(100),
    contingency_plan TEXT,
    
    -- Quality assurance
    compliance_docs JSONB,
    recent_qc_results JSONB,
    premix_source VARCHAR(255),
    quality_guarantee TEXT,
    sample_offer BOOLEAN NOT NULL DEFAULT false,
    
    -- Capacity & profile
    production_capacity JSONB,
    current_utilization DECIMAL(5,2),
    available_capacity TEXT,
    simultaneous_orders BOOLEAN NOT NULL DEFAULT true,
    scale_up_capability BOOLEAN NOT NULL DEFAULT false,
    
    -- Track record
    previous_orders JSONB,
    references JSONB,
    certifications JSONB,
    awards JSONB,
    
    -- Additional information
    value_added_services JSONB,
    sustainability TEXT,
    social_impact TEXT,
    risk_mitigation TEXT,
    supporting_docs JSONB,
    
    -- Status & metadata
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    match_score DECIMAL(5,2),
    evaluation_score DECIMAL(5,2),
    submitted_at TIMESTAMP,
    withdrawn_at TIMESTAMP,
    withdrawal_reason TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE,
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

CREATE INDEX idx_bids_rfp ON bids(rfp_id);
CREATE INDEX idx_bids_mill ON bids(mill_id);
CREATE INDEX idx_bids_status ON bids(status);

-- Bid questions
CREATE TABLE bid_questions (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bid_id VARCHAR(255) NOT NULL,
    questioner_id VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_at TIMESTAMP,
    answered_by VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE
);

-- Negotiations
CREATE TABLE negotiations (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bid_id VARCHAR(255) NOT NULL,
    initiator_id VARCHAR(255) NOT NULL,
    offer_type VARCHAR(50) NOT NULL,
    offer_details JSONB NOT NULL,
    response TEXT,
    responded_at TIMESTAMP,
    responded_by VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE
);

-- Purchase orders
CREATE TABLE purchase_orders (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    po_number VARCHAR(100) UNIQUE NOT NULL,
    rfp_id VARCHAR(255),
    bid_id VARCHAR(255),
    buyer_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255) NOT NULL,
    
    -- Order details
    product_specs JSONB NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    delivery_schedule JSONB NOT NULL,
    payment_terms VARCHAR(100) NOT NULL,
    quality_standards JSONB NOT NULL,
    
    -- Status & timeline
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    confirmed_by VARCHAR(255),
    production_start_date TIMESTAMP,
    expected_delivery_date TIMESTAMP,
    actual_delivery_date TIMESTAMP,
    
    -- Quality & compliance
    quality_checkpoints JSONB,
    batch_linkage JSONB,
    
    -- Financial
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_due_date TIMESTAMP,
    actual_payment_date TIMESTAMP,
    
    -- Issues & resolution
    issues JSONB,
    resolutions JSONB,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (rfp_id) REFERENCES rfps(id),
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles(id),
    FOREIGN KEY (mill_id) REFERENCES mills(id)
);

CREATE INDEX idx_purchase_orders_buyer ON purchase_orders(buyer_id);
CREATE INDEX idx_purchase_orders_mill ON purchase_orders(mill_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

-- ============================================================================
-- MODULE 8: LOGISTICS & DELIVERY
-- ============================================================================

-- Deliveries
CREATE TABLE deliveries (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    po_id VARCHAR(255) NOT NULL,
    location_id VARCHAR(255) NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    actual_date TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    
    -- Tracking
    driver_id VARCHAR(255),
    vehicle_info JSONB,
    tracking_url TEXT,
    estimated_arrival TIMESTAMP,
    
    -- Verification
    received_by VARCHAR(255),
    received_quantity DECIMAL(15,2),
    condition_notes TEXT,
    proof_of_delivery JSONB,
    issues JSONB,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_deliveries_po ON deliveries(po_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_scheduled_date ON deliveries(scheduled_date);

-- ============================================================================
-- MODULE 9: REVIEWS & RATINGS
-- ============================================================================

-- Order reviews
CREATE TABLE order_reviews (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    po_id VARCHAR(255) NOT NULL,
    reviewer_id VARCHAR(255) NOT NULL,
    reviewer_type VARCHAR(50) NOT NULL,
    
    -- Ratings (1-5)
    overall_rating DECIMAL(3,2) NOT NULL,
    product_quality DECIMAL(3,2),
    delivery_reliability DECIMAL(3,2),
    communication DECIMAL(3,2),
    value_for_money DECIMAL(3,2),
    payment_promptness DECIMAL(3,2),
    requirements_reasonableness DECIMAL(3,2),
    
    -- Written review
    review TEXT,
    would_recommend BOOLEAN,
    would_work_again BOOLEAN,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

-- Buyer reviews
CREATE TABLE buyer_reviews (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    buyer_id VARCHAR(255) NOT NULL,
    reviewer_id VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    review TEXT,
    would_accept_again BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles(id) ON DELETE CASCADE
);

-- Mill reviews
CREATE TABLE mill_reviews (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    mill_id VARCHAR(255) NOT NULL,
    reviewer_id VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    review TEXT,
    would_order_again BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

-- ============================================================================
-- MODULE 10: ALERTS & NOTIFICATIONS
-- ============================================================================

-- Alerts
CREATE TABLE alerts (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    summary TEXT,
    details JSONB,
    action_required TEXT,
    deadline TIMESTAMP,
    source_type VARCHAR(100) NOT NULL,
    source_id VARCHAR(255),
    mill_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_at TIMESTAMP,
    acknowledged_by VARCHAR(255),
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(255),
    resolution TEXT,
    metadata JSONB,
    trigger_condition JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (mill_id) REFERENCES mills(id),
    FOREIGN KEY (acknowledged_by) REFERENCES users(id),
    FOREIGN KEY (resolved_by) REFERENCES users(id)
);

CREATE INDEX idx_alerts_mill ON alerts(mill_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- Alert notifications
CREATE TABLE alert_notifications (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    scheduled_for TIMESTAMP NOT NULL DEFAULT NOW(),
    content JSONB,
    response_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alert escalations
CREATE TABLE alert_escalations (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_id VARCHAR(255) NOT NULL,
    from_user_id VARCHAR(255),
    to_user_id VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    escalated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    notes TEXT,
    metadata JSONB,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
);

-- Alert actions
CREATE TABLE alert_actions (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    evidence JSONB,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alert templates
CREATE TABLE alert_templates (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    summary TEXT,
    action_required TEXT,
    deadline_hours INTEGER,
    recipients JSONB NOT NULL,
    channels JSONB NOT NULL,
    escalation_path JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE notification_preferences (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    sms_enabled BOOLEAN NOT NULL DEFAULT true,
    push_enabled BOOLEAN NOT NULL DEFAULT true,
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
    quiet_hours_start VARCHAR(10),
    quiet_hours_end VARCHAR(10),
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    category_settings JSONB,
    digest_settings JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification delivery logs
CREATE TABLE notification_delivery_logs (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_id VARCHAR(255),
    notification_id VARCHAR(255),
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP NOT NULL,
    delivered_at TIMESTAMP,
    response_at TIMESTAMP,
    error TEXT,
    metadata JSONB
);

-- ============================================================================
-- MODULE 11: ACTION ITEMS MANAGEMENT
-- ============================================================================

-- Action items
CREATE TABLE action_items (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_action TEXT NOT NULL,
    assigned_to_id VARCHAR(255) NOT NULL,
    assigned_to_name VARCHAR(255) NOT NULL,
    assigned_to_email VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    due_date TIMESTAMP NOT NULL,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    related_batch_id VARCHAR(255),
    related_equipment_id VARCHAR(255),
    related_order_id VARCHAR(255),
    related_compliance_id VARCHAR(255),
    mill_id VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    completion_notes TEXT,
    completion_evidence JSONB,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    escalation_level INTEGER NOT NULL DEFAULT 0,
    last_escalated_at TIMESTAMP,
    tags JSONB,
    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    FOREIGN KEY (mill_id) REFERENCES mills(id)
);

CREATE INDEX idx_action_items_mill ON action_items(mill_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);

-- Action item notes
CREATE TABLE action_item_notes (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action_item_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (action_item_id) REFERENCES action_items(id) ON DELETE CASCADE
);

-- Action item evidence
CREATE TABLE action_item_evidence (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action_item_id VARCHAR(255) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    uploaded_by_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (action_item_id) REFERENCES action_items(id) ON DELETE CASCADE
);

-- Action item templates
CREATE TABLE action_item_templates (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_action TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    estimated_hours INTEGER,
    default_due_hours INTEGER NOT NULL,
    tags JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MODULE 12: REPORTING & ANALYTICS
-- ============================================================================

-- Report templates
CREATE TABLE report_templates (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id VARCHAR(255),
    sections JSONB NOT NULL,
    styling JSONB,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Scheduled reports
CREATE TABLE scheduled_reports (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255) NOT NULL,
    template_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    schedule JSONB NOT NULL,
    parameters JSONB,
    recipients JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    next_run TIMESTAMP NOT NULL,
    last_run TIMESTAMP,
    send_history JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (template_id) REFERENCES report_templates(id)
);

-- Report generations
CREATE TABLE report_generations (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    template_id VARCHAR(255),
    report_type VARCHAR(100) NOT NULL,
    parameters JSONB,
    format VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    file_path TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    generated_by VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    downloaded_at TIMESTAMP,
    download_count INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- MODULE 13: AUDIT LOGS & CHANGE HISTORY
-- ============================================================================

-- Audit logs
CREATE TABLE audit_logs (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- LEGACY PROCUREMENT (Backward Compatibility)
-- ============================================================================

-- Procurement requests (legacy)
CREATE TABLE procurement_requests (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    buyer_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    specifications JSONB,
    budget DECIMAL(15,2),
    deadline TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Procurement bids (legacy)
CREATE TABLE procurement_bids (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    request_id VARCHAR(255) NOT NULL,
    mill_id VARCHAR(255) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    delivery_date TIMESTAMP,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (request_id) REFERENCES procurement_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (mill_id) REFERENCES mills(id) ON DELETE CASCADE
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (Cross-module relationships)
-- ============================================================================

ALTER TABLE users ADD CONSTRAINT fk_users_mill 
    FOREIGN KEY (mill_id) REFERENCES mills(id);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mills_updated_at BEFORE UPDATE ON mills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batch_logs_updated_at BEFORE UPDATE ON batch_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_audits_updated_at BEFORE UPDATE ON compliance_audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_tasks_updated_at BEFORE UPDATE ON maintenance_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active batches with QC status
CREATE VIEW v_active_batches AS
SELECT 
    bl.*,
    m.name as mill_name,
    u.name as operator_name,
    COUNT(DISTINCT qct.id) as qc_test_count,
    AVG(CASE WHEN qct.status = 'PASS' THEN 1 ELSE 0 END) as pass_rate
FROM batch_logs bl
JOIN mills m ON bl.mill_id = m.id
JOIN users u ON bl.operator_id = u.id
LEFT JOIN qc_tests qct ON bl.id = qct.batch_id
WHERE bl.status IN ('IN_PROGRESS', 'QC_PENDING')
GROUP BY bl.id, m.name, u.name;

-- Pending compliance audits
CREATE VIEW v_pending_audits AS
SELECT 
    ca.*,
    m.name as mill_name,
    ct.name as template_name,
    u.name as auditor_name
FROM compliance_audits ca
JOIN mills m ON ca.mill_id = m.id
JOIN compliance_templates ct ON ca.template_id = ct.id
LEFT JOIN users u ON ca.auditor_id = u.id
WHERE ca.status IN ('IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW');

-- Overdue maintenance tasks
CREATE VIEW v_overdue_maintenance AS
SELECT 
    mt.*,
    e.name as equipment_name,
    e.type as equipment_type,
    m.name as mill_name,
    u.name as assigned_to_name
FROM maintenance_tasks mt
JOIN equipment e ON mt.equipment_id = e.id
JOIN mills m ON mt.mill_id = m.id
JOIN users u ON mt.assigned_to = u.id
WHERE mt.status = 'SCHEDULED' 
  AND mt.scheduled_date < NOW();

-- Active RFPs with bid counts
CREATE VIEW v_active_rfps AS
SELECT 
    r.*,
    bp.organization_name as buyer_name,
    COUNT(b.id) as bid_count,
    AVG(b.total_bid_amount) as avg_bid_amount
FROM rfps r
JOIN buyer_profiles bp ON r.buyer_id = bp.id
LEFT JOIN bids b ON r.id = b.rfp_id AND b.status = 'SUBMITTED'
WHERE r.status = 'OPEN'
GROUP BY r.id, bp.organization_name;

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_batch_logs_mill_status ON batch_logs(mill_id, status);
CREATE INDEX idx_batch_logs_mill_date ON batch_logs(mill_id, batch_date_time DESC);
CREATE INDEX idx_qc_tests_batch_status ON qc_tests(batch_id, status);
CREATE INDEX idx_compliance_audits_mill_status ON compliance_audits(mill_id, status);
CREATE INDEX idx_maintenance_tasks_mill_status ON maintenance_tasks(mill_id, status);
CREATE INDEX idx_alerts_mill_status_severity ON alerts(mill_id, status, severity);
CREATE INDEX idx_action_items_mill_status ON action_items(mill_id, status);
CREATE INDEX idx_rfps_status_deadline ON rfps(status, bid_deadline);
CREATE INDEX idx_bids_rfp_status ON bids(rfp_id, status);
CREATE INDEX idx_purchase_orders_buyer_status ON purchase_orders(buyer_id, status);
CREATE INDEX idx_deliveries_po_status ON deliveries(po_id, status);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Core user accounts with role-based access';
COMMENT ON TABLE mills IS 'Fortification mills/facilities';
COMMENT ON TABLE batch_logs IS 'Production batch records with fortification details';
COMMENT ON TABLE compliance_audits IS 'Compliance audits (self-audits and inspector audits)';
COMMENT ON TABLE maintenance_tasks IS 'Equipment maintenance tasks and calibrations';
COMMENT ON TABLE rfps IS 'Request for Proposals from institutional buyers';
COMMENT ON TABLE bids IS 'Mill bids in response to RFPs';
COMMENT ON TABLE purchase_orders IS 'Confirmed purchase orders';
COMMENT ON TABLE alerts IS 'System-generated alerts for quality, compliance, and maintenance';
COMMENT ON TABLE action_items IS 'Actionable tasks generated from alerts';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
