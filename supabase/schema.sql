-- Create Tables

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remember_token VARCHAR(64) DEFAULT NULL
);

CREATE TABLE super_admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  duration_days INT NOT NULL DEFAULT 30,
  max_subscribers INT NOT NULL DEFAULT 0,
  products_limit INT NOT NULL DEFAULT 50,
  orders_limit INT NOT NULL DEFAULT 100,
  enable_notifications BOOLEAN DEFAULT FALSE,
  enable_slider BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  custom_color BOOLEAN DEFAULT FALSE,
  cycle_count INT DEFAULT 0,
  lock_until TIMESTAMP DEFAULT NULL
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_name VARCHAR(100) NOT NULL,
  store_slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_order_id INT NOT NULL DEFAULT 0,
  plan_id INT DEFAULT NULL REFERENCES subscription_plans(id) ON DELETE SET NULL,
  plan_expires_at TIMESTAMP DEFAULT NULL,
  used_free_trial BOOLEAN DEFAULT FALSE
);

CREATE TABLE appearance (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  store_title VARCHAR(255) DEFAULT 'متجر Traivo الرائع',
  items_per_page INT DEFAULT 12,
  enable_cart BOOLEAN DEFAULT TRUE,
  show_coupon BOOLEAN DEFAULT FALSE,
  show_categories BOOLEAN NOT NULL DEFAULT TRUE,
  enable_contact BOOLEAN NOT NULL DEFAULT TRUE,
  store_phone VARCHAR(50) DEFAULT NULL,
  main_logo VARCHAR(255) DEFAULT '',
  font_family VARCHAR(50) DEFAULT 'Cairo',
  primary_color VARCHAR(20) DEFAULT '#007bff',
  store_image_1 VARCHAR(255) DEFAULT NULL,
  store_image_2 VARCHAR(255) DEFAULT NULL,
  store_image_3 VARCHAR(255) DEFAULT NULL,
  store_image_4 VARCHAR(255) DEFAULT NULL,
  about_links TEXT DEFAULT NULL,
  policy_links TEXT DEFAULT NULL,
  social_links TEXT DEFAULT NULL,
  enable_email_notif BOOLEAN NOT NULL DEFAULT FALSE,
  notification_email VARCHAR(255) DEFAULT NULL,
  notification_app_password VARCHAR(255) DEFAULT NULL,
  enable_slider BOOLEAN DEFAULT TRUE
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(store_id, slug)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(255) DEFAULT NULL,
  short_description TEXT DEFAULT NULL,
  slug VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2) DEFAULT 0.00,
  cost_price DECIMAL(10,2) DEFAULT 0.00,
  category_id INT DEFAULT 0,
  is_landing_page BOOLEAN NOT NULL DEFAULT FALSE,
  landing_page_image VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  gallery_images TEXT DEFAULT NULL,
  variations TEXT DEFAULT NULL,
  offers TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visits_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  state VARCHAR(50) NOT NULL,
  municipality VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  phone_status VARCHAR(50) DEFAULT 'جديد',
  delivery_status VARCHAR(50) DEFAULT 'قيد-التجهيز',
  quantity INT DEFAULT 1,
  total_price DECIMAL(10,2) DEFAULT 0.00,
  cart_data TEXT DEFAULT NULL
);

CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discount_type VARCHAR(20) DEFAULT 'percent',
  expiry_date DATE DEFAULT NULL,
  usage_limit INT DEFAULT 0,
  times_used INT DEFAULT 0
);

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  setting_key VARCHAR(50) NOT NULL,
  setting_value TEXT NOT NULL,
  UNIQUE(store_id, setting_key)
);

CREATE TABLE shipping_accounts (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  company_name VARCHAR(100) NOT NULL,
  account_name VARCHAR(100) NOT NULL,
  api_id VARCHAR(255) NOT NULL,
  api_token VARCHAR(255) NOT NULL,
  sender_wilaya VARCHAR(50) DEFAULT NULL,
  free_delivery BOOLEAN DEFAULT FALSE,
  auto_ship BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipping_zones (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  home_price DECIMAL(10,2) DEFAULT 0.00,
  desk_price DECIMAL(10,2) DEFAULT 0.00,
  municipalities TEXT DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_visits (
  visit_date DATE NOT NULL,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  visits_count INT DEFAULT 1,
  PRIMARY KEY (store_id, visit_date)
);

CREATE TABLE user_messages (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  has_button BOOLEAN DEFAULT FALSE,
  button_title VARCHAR(255) DEFAULT NULL,
  button_link VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
