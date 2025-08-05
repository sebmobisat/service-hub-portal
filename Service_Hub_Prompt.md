## Prompt for Cursor.AI – Service Hub Portal

You are now working on the development of a new advanced web portal called **Service Hub Portal**.
I’ve already created a folder named `service-hub-portal`, which contains a `references` subfolder with all the key materials you need to start.

---

### 📁 Folder Structure Provided:

**`references/`** contains:

1. **`docs/`**
   - `Service Hub - prompt.docx` – This exact prompt
   - `Service Hub - Specs.docx` – A detailed project structure and feature draft written by ChatGPT

2. **`mobisat-db-reader/`**
   - A simple internal portal we’ve developed to access our Mobisat database.  
     👉 Use this as a reference to connect to the **Mobisat PostgreSQL database** for Service Hub Portal.  
     Connection credentials and structure can be copied directly from here.

3. **`new_mobisat.com/`**
   - This is the codebase of our official Mobisat website.  
     Cursor must **replicate the same architecture** for:
     - Header and footer loading (dynamic inclusion)
     - Light/dark theme toggling
     - English/Italian language switcher
     - SEO metadata, page structure, and best practices
     - Styling and responsiveness

---

### 🛠 Initial Development Goals

Start by organizing the folder and file structure clearly:

```
/service-hub-portal
├── css/
├── js/
├── images/
├── pages/
├── index.html
└── ...
```

- All **JavaScript** files must go into the `js/` folder  
- All **CSS** files into the `css/` folder  
- All **images** into the `images/` folder

---

### 🔐 Login Page Requirements

- Build a **secure login page** that authenticates via **PIN**.
- The only users allowed to log in are **dealers listed in the `dealer` table** of the Mobisat database.
  - The email must match the value in the field: `companyLoginEmail`.

---

### 💽 Homepage Requirements

- Start developing a **homepage** following the Mobisat website’s exact structure and style.
- Use the **Service Hub logo**, located at:  
  `C:\Users\sebas\Desktop\dealer-station\references\new_mobisat.com\images\ServiceHub Logo`

---

### ♻️ Next Action

Please create a **detailed task list** for the first phase of development, including:

1. Replication of the Mobisat site's architecture and styling
2. Implementation of dynamic header/footer
3. Setup of the homepage using the Service Hub logo
4. Secure login page with PIN-based auth via database check
5. Folder structure and basic routing

Once this is ready, I will review and approve the task list before we proceed with development.

# Service Hub Portal - Development Guidelines

## Database Migration Strategy (Current Phase)

### Migration Plan
1. **Phase 1**: Connect to Supabase and create new database structure/tables
2. **Phase 2**: Keep current database in **read-only mode** for existing functionality
3. **Phase 3**: Test and validate new Supabase structure until working properly
4. **Phase 4**: Only after Supabase validation, create same tables in Mobisat database
5. **Phase 5**: Switch to using new Mobisat tables for full read/write operations

### Current Implementation Strategy
- **Existing Data**: Keep certificates, vehicles, dealers in current PostgreSQL (read-only)
- **New Features**: Create vehicle groups functionality in Supabase
- **Unified Access**: Combine data from both sources seamlessly
- **Future Migration**: Eventually migrate all to Mobisat database

### Key Principles
- Current database remains read-only during development phase
- Supabase serves as "sandbox" for new structure experimentation
- Only implement in Mobisat after Supabase validation
- Ensures zero downtime and safe migration path
- Maintains existing system functionality during transition

### Implementation Notes
- All new development should target Supabase first
- Existing functionality continues using current database (read-only)
- Clear validation steps before Mobisat implementation
- Risk mitigation through staged approach
