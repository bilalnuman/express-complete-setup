console.log(
    "npm run r -- route name -c controller name || To create route\n",
    "npm run r controller name || To create controller"
)


clg(`drop all tables => 
    
    DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop all tables in the public schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

    
    `)