# WordPress - Adding to REST API

When adding a post type to the REST API:

1. Create custom post type in `/wp-includes/functions.php`
2. Add custom fields in local WordPress dashboard using ACF and associate fields with custom post type
3. Register post type routes for REST API in `/data/setup-wpapi.ts`