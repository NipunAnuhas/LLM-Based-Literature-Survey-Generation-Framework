# How to Show Your Database in Presentation

## 📊 Step-by-Step Guide to Demonstrate Your PostgreSQL Database

---

## METHOD 1: Show the Database Schema (SQL File) ⭐ RECOMMENDED

### Step 1: Open the Schema File in VS Code

1. In VS Code, navigate to: `packages/backend/migrations/001_init_schema.sql`
2. **Zoom in** (Ctrl + Plus) so text is clearly visible
3. This file shows your complete database design

### Step 2: Explain While Scrolling

**Start at the top and say:**

> "Let me show you my database schema. I'm using PostgreSQL with three main tables..."

**Scroll to `workflow_executions` table (line ~8):**

```sql
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN (...)),
  ...
)
```

**Point and say:**
> "This table stores the workflow execution state. Each survey generation creates one record here. Notice I'm using:
> - **UUID** for unique IDs
> - **CHECK constraints** to ensure status is valid
> - **JSONB** for flexible data like options and errors
> - **Timestamps** to track when workflows start and complete"

**Scroll to `papers` table (line ~30):**

```sql
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors JSONB NOT NULL DEFAULT '[]'::jsonb,
  ...
)
```

**Point and say:**
> "The papers table stores intermediate results - all the papers retrieved during the workflow. Key features:
> - **Foreign key** to workflow_executions ensures data integrity
> - **CASCADE delete** - when a workflow is deleted, its papers are too
> - **JSONB for authors** - flexible array storage
> - **Quality and relevance scores** - assigned by LLMs during validation and evaluation"

**Scroll to `surveys` table (line ~50):**

```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID NOT NULL UNIQUE REFERENCES workflow_executions(id),
  topic TEXT NOT NULL,
  content JSONB NOT NULL,
  ...
)
```

**Point and say:**
> "The surveys table stores the final generated literature surveys. Notice:
> - **UNIQUE constraint** on execution_id - one survey per workflow
> - **JSONB for content** - stores the entire survey structure (introduction, sections, conclusion, references)
> - **JSONB for metadata** - paper count, word count, themes"

**Scroll to indexes (line ~65):**

```sql
CREATE INDEX idx_executions_status ON workflow_executions(status);
CREATE INDEX idx_executions_created_at ON workflow_executions(created_at DESC);
...
```

**Point and say:**
> "I've added indexes on frequently queried columns for performance:
> - Status index for filtering workflows
> - Created_at index for sorting by date
> - Execution_id indexes for fast joins"

**Scroll to the trigger (line ~75):**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;
```

**Point and say:**
> "I use a PostgreSQL trigger to automatically update the updated_at timestamp whenever a workflow record changes. This is a database-level feature that ensures timestamps are always accurate."

---

## METHOD 2: Show Database Connection Code

### Open: `packages/backend/src/config/database.ts`

**Say:**
> "Here's how I connect to PostgreSQL from Node.js..."

**Point to the connection pool:**

```typescript
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'literature_survey',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maximum number of connections
});
```

**Say:**
> "I use connection pooling with a maximum of 20 connections for efficiency. The configuration comes from environment variables for security and flexibility."

---

## METHOD 3: Show Live Database (If Docker is Running)

### Option A: Using pgAdmin (If Installed)

1. Open pgAdmin
2. Connect to localhost:5432
3. Navigate to: Servers → PostgreSQL 15 → Databases → literature_survey → Schemas → public → Tables
4. Show the 3 tables: workflow_executions, papers, surveys
5. Right-click on a table → View/Edit Data → First 100 Rows

**Say:**
> "Here's the live database. You can see actual data from survey generations..."

### Option B: Using Command Line (Quick & Professional)

**Open a terminal and run:**

```bash
# Connect to PostgreSQL
docker exec -it literature-survey-system-postgres-1 psql -U postgres -d literature_survey

# Show tables
\dt

# Describe workflow_executions table
\d workflow_executions

# Show some data
SELECT id, topic, status, progress FROM workflow_executions LIMIT 5;

# Show relationships
\d papers

# Exit
\q
```

**Say while typing:**
> "Let me connect to the live database... Here are the three tables... Let me show you the structure of workflow_executions... And here's some actual data from recent survey generations..."

### Option C: Using VS Code Extension (If Installed)

1. Install "PostgreSQL" extension by Chris Kolkman
2. Click the PostgreSQL icon in sidebar
3. Add connection: localhost:5432, database: literature_survey
4. Browse tables visually
5. Run queries in VS Code

---

## METHOD 4: Show Database Queries in Code

### Open: `packages/backend/src/services/workflowService.ts`

**Scroll to a query function:**

```typescript
export async function createWorkflowExecution(
  topic: string,
  options?: WorkflowOptions
): Promise<WorkflowExecution> {
  const result = await pool.query(
    `INSERT INTO workflow_executions (topic, status, progress, message, options)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [topic, 'initiated', 0, 'Workflow initiated', JSON.stringify(options || {})]
  );
  return result.rows[0];
}
```

**Say:**
> "Here's how I interact with the database from Node.js. I use parameterized queries ($1, $2, etc.) to prevent SQL injection attacks. The RETURNING * clause gives me back the created record with its generated UUID."

---

## 🎯 RECOMMENDED PRESENTATION FLOW

### For a 5-Minute Demo:

1. **Show the schema file** (2 minutes)
   - Open `001_init_schema.sql`
   - Explain the 3 tables and their relationships
   - Point out key features (foreign keys, JSONB, indexes)

2. **Show the ER diagram** (1 minute)
   - Draw on whiteboard or show from INTERIM_REPORT.md
   - workflow_executions (1) → (N) papers
   - workflow_executions (1) → (1) surveys

3. **Show database connection code** (1 minute)
   - Open `database.ts`
   - Explain connection pooling

4. **Show a query example** (1 minute)
   - Open `workflowService.ts`
   - Show one INSERT and one SELECT query

### For a 10-Minute Demo:

Do everything above PLUS:

5. **Show live database** (3 minutes)
   - Connect via command line
   - Show tables with `\dt`
   - Show actual data with SELECT queries
   - Show table structure with `\d table_name`

6. **Answer questions** (2 minutes)

---

## 📝 KEY POINTS TO EMPHASIZE

When showing your database, make sure to mention:

### ✅ Design Decisions:

1. **"I chose PostgreSQL because..."**
   - Relational data model fits my use case
   - JSONB support for flexible schema
   - ACID compliance for data integrity
   - Production-ready and scalable

2. **"I use UUIDs instead of auto-increment IDs because..."**
   - Globally unique across distributed systems
   - No collision risk
   - Better for APIs (can't guess IDs)

3. **"I use JSONB for semi-structured data because..."**
   - Survey content varies (different sections, themes)
   - Paper metadata can have optional fields
   - Faster than JSON (binary format)
   - Can still query inside JSONB with PostgreSQL

4. **"I added foreign keys and constraints because..."**
   - Ensures data integrity at database level
   - Prevents orphaned records
   - CASCADE delete keeps data clean
   - CHECK constraints validate data

5. **"I created indexes because..."**
   - Faster queries on status and dates
   - Important for pagination and filtering
   - Minimal overhead for writes

### ✅ Relationships:

**Draw this on whiteboard or paper:**

```
┌─────────────────────┐
│ workflow_executions │
│  - id (PK)          │
│  - topic            │
│  - status           │
│  - progress         │
└──────────┬──────────┘
           │
           │ 1:N
           │
    ┌──────▼──────┐
    │   papers    │
    │  - id (PK)  │
    │  - exec_id  │ (FK)
    │  - title    │
    │  - authors  │
    └─────────────┘

┌─────────────────────┐
│ workflow_executions │
└──────────┬──────────┘
           │
           │ 1:1
           │
    ┌──────▼──────┐
    │   surveys   │
    │  - id (PK)  │
    │  - exec_id  │ (FK, UNIQUE)
    │  - content  │
    └─────────────┘
```

**Say:**
> "One workflow can have many papers (1:N relationship), but only one final survey (1:1 relationship). The foreign keys ensure referential integrity."

---

## 🎬 PRACTICE SCRIPT

**Practice saying this out loud:**

> "For data persistence, I'm using PostgreSQL 15, a robust relational database. Let me show you the schema...
>
> [Open 001_init_schema.sql]
>
> I have three main tables: workflow_executions, papers, and surveys.
>
> The workflow_executions table tracks each survey generation from start to finish. It stores the topic, current status, progress percentage, and any error information. I'm using JSONB for flexible data like user options.
>
> The papers table stores intermediate results - all the papers retrieved during the workflow. It has a foreign key to workflow_executions with CASCADE delete, so when a workflow is deleted, its papers are automatically removed too.
>
> The surveys table stores the final generated literature surveys. Notice the UNIQUE constraint on execution_id - this ensures one survey per workflow. The content is stored as JSONB because survey structure can vary.
>
> I've added indexes on frequently queried columns for performance, and I use a PostgreSQL trigger to automatically update timestamps.
>
> [Optional: Show live database]
>
> Here's the live database with actual data from recent survey generations..."

---

## 🚨 COMMON QUESTIONS & ANSWERS

### Q: "Why not use MongoDB or NoSQL?"

**Answer:**
> "Great question! I chose PostgreSQL over NoSQL for several reasons:
> 
> 1. **My data has clear relationships** - workflows, papers, and surveys are related
> 2. **I need ACID guarantees** - data integrity is important for academic work
> 3. **PostgreSQL has JSONB** - I get the flexibility of NoSQL where I need it (survey content) while keeping relational benefits
> 4. **Better for complex queries** - I can join tables, use foreign keys, and enforce constraints at the database level
> 5. **Production-proven** - PostgreSQL is battle-tested in large-scale systems
>
> MongoDB would work, but I'd lose referential integrity and have to handle relationships in application code."

### Q: "How do you handle database migrations?"

**Answer:**
> "I use SQL migration files in the `migrations/` folder. Each migration is numbered (001, 002, etc.) and can be run in order. For production, I'd use a migration tool like Flyway or node-pg-migrate to track which migrations have been applied. Currently, I run migrations manually with:
>
> ```bash
> docker exec -it postgres psql -U postgres -d literature_survey -f /migrations/001_init_schema.sql
> ```
>
> This ensures the database schema is version-controlled and reproducible."

### Q: "What about database backups?"

**Answer:**
> "For production, I'd implement:
> 1. **Automated daily backups** using pg_dump
> 2. **Point-in-time recovery** with WAL archiving
> 3. **Backup to cloud storage** (AWS S3 or similar)
> 4. **Regular backup testing** to ensure recovery works
>
> For development, Docker volumes persist data, and I can export/import with pg_dump/pg_restore."

### Q: "How do you handle database performance?"

**Answer:**
> "Several strategies:
> 1. **Indexes** on frequently queried columns (status, created_at, execution_id)
> 2. **Connection pooling** (max 20 connections) for efficiency
> 3. **JSONB** instead of JSON for faster queries
> 4. **Proper data types** (UUID, TIMESTAMP WITH TIME ZONE)
> 5. **Query optimization** using EXPLAIN ANALYZE
>
> For scaling, PostgreSQL supports read replicas, partitioning, and connection pooling at the application level."

---

## 💡 PRO TIPS

1. **Zoom in** - Make sure SQL is readable (Ctrl + Plus in VS Code)
2. **Use syntax highlighting** - VS Code makes SQL colorful and easy to read
3. **Scroll slowly** - Give people time to read
4. **Point with cursor** - Highlight what you're talking about
5. **Explain jargon** - Not everyone knows what JSONB or CASCADE means
6. **Show confidence** - You designed this, you know it well!
7. **Have backup** - If live database fails, the SQL file is enough

---

## 📸 SCREENSHOTS TO PREPARE (Optional)

If you want to create slides, take screenshots of:

1. The schema file (001_init_schema.sql) with the 3 CREATE TABLE statements
2. The ER diagram from your interim report
3. A query example from workflowService.ts
4. Live database showing actual data (if Docker is running)

---

Good luck! Your database design is solid and professional. 🎉

