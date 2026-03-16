import sqlite3
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

DB_NAME = "marketing_agency.db"

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# -------------------------------
# CREATE TABLES
# -------------------------------

cursor.executescript("""

DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS ads;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS conversions;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS performance_metrics;

CREATE TABLE clients(
    client_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    industry TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    created_at DATE
);

CREATE TABLE employees(
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT,
    department TEXT,
    salary INTEGER,
    hired_date DATE
);

CREATE TABLE campaigns(
    campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    campaign_name TEXT,
    objective TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT,
    FOREIGN KEY(client_id) REFERENCES clients(client_id)
);

CREATE TABLE channels(
    channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_name TEXT
);

CREATE TABLE ads(
    ad_id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    channel_id INTEGER,
    ad_type TEXT,
    ad_title TEXT,
    created_at DATE,
    FOREIGN KEY(campaign_id) REFERENCES campaigns(campaign_id),
    FOREIGN KEY(channel_id) REFERENCES channels(channel_id)
);

CREATE TABLE budgets(
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    total_budget REAL,
    spent REAL,
    remaining REAL,
    FOREIGN KEY(campaign_id) REFERENCES campaigns(campaign_id)
);

CREATE TABLE leads(
    lead_id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    lead_source TEXT,
    lead_score INTEGER,
    created_at DATE,
    FOREIGN KEY(campaign_id) REFERENCES campaigns(campaign_id)
);

CREATE TABLE conversions(
    conversion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    revenue REAL,
    converted_at DATE,
    FOREIGN KEY(lead_id) REFERENCES leads(lead_id)
);

CREATE TABLE tasks(
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    employee_id INTEGER,
    task_name TEXT,
    status TEXT,
    deadline DATE,
    FOREIGN KEY(campaign_id) REFERENCES campaigns(campaign_id),
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE performance_metrics(
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad_id INTEGER,
    impressions INTEGER,
    clicks INTEGER,
    ctr REAL,
    cpc REAL,
    conversions INTEGER,
    recorded_date DATE,
    FOREIGN KEY(ad_id) REFERENCES ads(ad_id)
);

""")

# -------------------------------
# STATIC CHANNELS
# -------------------------------

channels = ["Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads", "TikTok Ads", "Email Marketing"]

for c in channels:
    cursor.execute("INSERT INTO channels(channel_name) VALUES(?)", (c,))

# -------------------------------
# EMPLOYEES
# -------------------------------

roles = ["Marketing Manager","SEO Specialist","Content Strategist","Ad Specialist","Data Analyst"]

for _ in range(20):
    cursor.execute("""
    INSERT INTO employees(name,role,department,salary,hired_date)
    VALUES(?,?,?,?,?)
    """,(
        fake.name(),
        random.choice(roles),
        "Marketing",
        random.randint(40000,120000),
        fake.date_between(start_date='-3y', end_date='today')
    ))

# -------------------------------
# CLIENTS
# -------------------------------

industries = ["Ecommerce","SaaS","Fintech","Healthcare","Education","Retail"]

for _ in range(30):
    cursor.execute("""
    INSERT INTO clients(company_name,industry,contact_person,email,phone,country,created_at)
    VALUES(?,?,?,?,?,?,?)
    """,(
        fake.company(),
        random.choice(industries),
        fake.name(),
        fake.email(),
        fake.phone_number(),
        fake.country(),
        fake.date_between(start_date='-2y', end_date='today')
    ))

# -------------------------------
# CAMPAIGNS
# -------------------------------

objectives = ["Brand Awareness","Lead Generation","Sales Conversion","App Installs"]

for _ in range(80):
    start = fake.date_between(start_date='-1y', end_date='today')
    end = start + timedelta(days=random.randint(30,180))

    cursor.execute("""
    INSERT INTO campaigns(client_id,campaign_name,objective,start_date,end_date,status)
    VALUES(?,?,?,?,?,?)
    """,(
        random.randint(1,30),
        fake.bs().title(),
        random.choice(objectives),
        start,
        end,
        random.choice(["Active","Paused","Completed"])
    ))

# -------------------------------
# ADS
# -------------------------------

ad_types = ["Video","Image","Carousel","Search","Display"]

for _ in range(200):
    cursor.execute("""
    INSERT INTO ads(campaign_id,channel_id,ad_type,ad_title,created_at)
    VALUES(?,?,?,?,?)
    """,(
        random.randint(1,80),
        random.randint(1,len(channels)),
        random.choice(ad_types),
        fake.catch_phrase(),
        fake.date_between(start_date='-1y', end_date='today')
    ))

# -------------------------------
# BUDGETS
# -------------------------------

for campaign_id in range(1,81):
    total = random.randint(5000,50000)
    spent = random.randint(1000,total)
    remaining = total - spent

    cursor.execute("""
    INSERT INTO budgets(campaign_id,total_budget,spent,remaining)
    VALUES(?,?,?,?)
    """,(campaign_id,total,spent,remaining))

# -------------------------------
# LEADS
# -------------------------------

sources = ["Google","Facebook","Instagram","Email","Referral"]

for _ in range(2000):
    cursor.execute("""
    INSERT INTO leads(campaign_id,lead_source,lead_score,created_at)
    VALUES(?,?,?,?)
    """,(
        random.randint(1,80),
        random.choice(sources),
        random.randint(10,100),
        fake.date_between(start_date='-1y', end_date='today')
    ))

# -------------------------------
# CONVERSIONS
# -------------------------------

for lead_id in range(1,2001):
    if random.random() < 0.25:
        cursor.execute("""
        INSERT INTO conversions(lead_id,revenue,converted_at)
        VALUES(?,?,?)
        """,(
            lead_id,
            random.randint(100,5000),
            fake.date_between(start_date='-1y', end_date='today')
        ))

# -------------------------------
# TASKS
# -------------------------------

task_names = ["Create Ads","Optimize Campaign","SEO Audit","Content Planning","Performance Analysis"]

for _ in range(300):
    cursor.execute("""
    INSERT INTO tasks(campaign_id,employee_id,task_name,status,deadline)
    VALUES(?,?,?,?,?)
    """,(
        random.randint(1,80),
        random.randint(1,20),
        random.choice(task_names),
        random.choice(["Pending","In Progress","Completed"]),
        fake.date_between(start_date='today', end_date='+60d')
    ))

# -------------------------------
# PERFORMANCE METRICS
# -------------------------------

for ad_id in range(1,201):

    for _ in range(5):

        impressions = random.randint(1000,100000)
        clicks = random.randint(50,5000)

        ctr = clicks / impressions
        cpc = round(random.uniform(0.1,5.0),2)
        conversions = random.randint(1,200)

        cursor.execute("""
        INSERT INTO performance_metrics(ad_id,impressions,clicks,ctr,cpc,conversions,recorded_date)
        VALUES(?,?,?,?,?,?,?)
        """,(
            ad_id,
            impressions,
            clicks,
            ctr,
            cpc,
            conversions,
            fake.date_between(start_date='-6m', end_date='today')
        ))

conn.commit()
conn.close()

print("Database generated: marketing_agency.db")