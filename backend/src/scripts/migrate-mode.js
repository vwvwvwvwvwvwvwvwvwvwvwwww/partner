/**
 * Импортируйте первой строкой из migrate.js (до pool/env).
 * Тогда env.js не требует реальный JWT_SECRET для pre-deploy / CI.
 */
process.env.AGRO_ERP_MIGRATE_SCRIPT = '1';
