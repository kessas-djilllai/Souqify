-- Seed data for testing

INSERT INTO users (id, full_name, email, password, created_at, remember_token) VALUES
(89, 'Djillali Kessas', '0696666164kk@gmail.com', '$2y$10$joX7CIxKX4HzPDIwwryfYOLBzTgCKDhiPyd5sMYgrrA2Gp06xdMBO', '2026-04-23 23:38:01', '1a82fc3374e86461f4c37da65d97f42f399100313c8f6fb55926282057a64099'),
(91, 'Free Fire', '0696666164nihed@gmail.com', '$2y$10$go18YAf10wVR8IC7pxwkh.lUbh3iVW2ObatUJJMTEpCITxbPW/qxG', '2026-06-16 14:19:29', NULL);

INSERT INTO super_admins (id, username, password, created_at) VALUES
(1, 'souqifydmin', '$2y$10$hrQZYsjMj6IK3TcIVaKu5uZRVkMq0RT/vupLyF6b7qows0UYNBsMK', '2026-03-31 20:45:07');

INSERT INTO subscription_plans (id, plan_name, price, duration_days, max_subscribers, products_limit, orders_limit, enable_notifications, enable_slider, created_at, custom_color, cycle_count, lock_until) VALUES
(2, 'المجانية', 0.00, 7, 8, 15, 50, false, true, '2026-03-29 20:45:45', false, 3, NULL),
(4, 'البارعين', 800.00, 30, 30, 0, 0, true, true, '2026-03-31 13:45:08', true, 0, NULL),
(5, 'المهنية', 500.00, 30, 20, 50, 100, false, true, '2026-04-01 01:19:48', true, 3, NULL);

INSERT INTO stores (id, user_id, store_name, store_slug, created_at, last_seen_order_id, plan_id, plan_expires_at, used_free_trial) VALUES
(89, 89, 'Kessas', 'kessas', '2026-04-23 23:38:01', 116, 2, '2026-04-30 19:38:01', true),
(91, 91, 'متجر يينين', 'kakmel', '2026-06-16 14:19:29', 0, 2, '2026-06-23 10:19:29', true);

INSERT INTO appearance (id, store_id, store_title, items_per_page, enable_cart, show_coupon, show_categories, enable_contact, store_phone, main_logo, font_family, primary_color, store_image_1, store_image_2, store_image_3, store_image_4, about_links, policy_links, social_links, enable_email_notif, notification_email, notification_app_password, enable_slider) VALUES
(91, 89, 'Kessas', 6, true, false, true, true, NULL, 'example/logo_images/logo.png', 'Cairo', '#0d6efd', 'example/slider_images/slide1.png', 'example/slider_images/slide2.png', 'example/slider_images/slide3.png', 'example/slider_images/slide4.png', NULL, NULL, NULL, false, NULL, NULL, true),
(93, 91, 'متجر يينين', 6, true, false, true, true, NULL, 'example/logo_images/logo.png', 'Cairo', '#0d6efd', 'example/slider_images/slide1.png', 'example/slider_images/slide2.png', 'example/slider_images/slide3.png', 'example/slider_images/slide4.png', NULL, NULL, NULL, false, NULL, NULL, true);

INSERT INTO categories (id, store_id, name, slug, image_url, created_at) VALUES
(1385, 89, 'ساعات يد', 'kessas-watches', 'example/categories_images/wristwatches.png', '2026-04-23 16:38:01'),
(1386, 89, 'هواتف ذكية', 'kessas-smartphones', 'example/categories_images/smart phone.png', '2026-04-23 16:38:01'),
(1387, 89, 'حواسيب', 'kessas-computers', 'example/categories_images/computers.png', '2026-04-23 16:38:01'),
(1388, 89, 'ملابس رجال', 'kessas-mens-clothing', 'example/categories_images/mens clothing.png', '2026-04-23 16:38:01'),
(1389, 89, 'ملابس نساء', 'kessas-womens-clothing', 'example/categories_images/womens clothing.png', '2026-04-23 16:38:01'),
(1390, 89, 'ملابس اطفال ذكور', 'kessas-boys-clothing', 'example/categories_images/boys clothing.png', '2026-04-23 16:38:01'),
(1391, 89, 'ملابس اطفال اناث', 'kessas-girls-clothing', 'example/categories_images/girls childrens clothing.png', '2026-04-23 16:38:01'),
(1392, 89, 'احذية رجال', 'kessas-mens-shoes', 'example/categories_images/mens shoes.png', '2026-04-23 16:38:01'),
(1393, 89, 'احذية نساء', 'kessas-womens-shoes', 'example/categories_images/womens shoes.png', '2026-04-23 16:38:01'),
(1394, 89, 'معدات رياضية', 'kessas-sports-equipment', 'example/categories_images/sports equipment.png', '2026-04-23 16:38:01'),
(1395, 89, 'مكملات غذائية', 'kessas-supplements', 'example/categories_images/dietary supplements.png', '2026-04-23 16:38:01'),
(1396, 89, 'المنزل والمطبخ', 'kessas-home-kitchen', 'example/categories_images/home and kitchen.png', '2026-04-23 16:38:01'),
(1397, 89, 'كتب تعليمية', 'kessas-educational-books', 'example/categories_images/educational books.png', '2026-04-23 16:38:01'),
(1398, 89, 'مواد تجميل', 'kessas-cosmetics', 'example/categories_images/cosmetics.png', '2026-04-23 16:38:01'),
(1399, 89, 'كاميرات', 'kessas-cameras', 'example/categories_images/cameras.png', '2026-04-23 16:38:01'),
(1400, 89, 'العاب اطفال', 'kessas-kids-toys', 'example/categories_images/children games.png', '2026-04-23 16:38:01'),
(1401, 89, 'حقائب', 'kessas-bags', 'example/categories_images/bags.png', '2026-04-23 16:38:01'),
(1402, 89, 'اكسسوارات', 'kessas-accessories', 'example/categories_images/accessories.png', '2026-04-23 16:38:01'),
(1421, 91, 'ساعات يد', 'kakmel-watches', 'example/categories_images/wristwatches.png', '2026-06-16 07:19:29'),
(1422, 91, 'هواتف ذكية', 'kakmel-smartphones', 'example/categories_images/smart phone.png', '2026-06-16 07:19:29'),
(1423, 91, 'حواسيب', 'kakmel-computers', 'example/categories_images/computers.png', '2026-06-16 07:19:29'),
(1424, 91, 'ملابس رجال', 'kakmel-mens-clothing', 'example/categories_images/mens clothing.png', '2026-06-16 07:19:29'),
(1425, 91, 'ملابس نساء', 'kakmel-womens-clothing', 'example/categories_images/womens clothing.png', '2026-06-16 07:19:29'),
(1426, 91, 'ملابس اطفال ذكور', 'kakmel-boys-clothing', 'example/categories_images/boys clothing.png', '2026-06-16 07:19:29'),
(1427, 91, 'ملابس اطفال اناث', 'kakmel-girls-clothing', 'example/categories_images/girls childrens clothing.png', '2026-06-16 07:19:29'),
(1428, 91, 'احذية رجال', 'kakmel-mens-shoes', 'example/categories_images/mens shoes.png', '2026-06-16 07:19:29'),
(1429, 91, 'احذية نساء', 'kakmel-womens-shoes', 'example/categories_images/womens shoes.png', '2026-06-16 07:19:29'),
(1430, 91, 'معدات رياضية', 'kakmel-sports-equipment', 'example/categories_images/sports equipment.png', '2026-06-16 07:19:29'),
(1431, 91, 'مكملات غذائية', 'kakmel-supplements', 'example/categories_images/dietary supplements.png', '2026-06-16 07:19:29'),
(1432, 91, 'المنزل والمطبخ', 'kakmel-home-kitchen', 'example/categories_images/home and kitchen.png', '2026-06-16 07:19:29'),
(1433, 91, 'كتب تعليمية', 'kakmel-educational-books', 'example/categories_images/educational books.png', '2026-06-16 07:19:29'),
(1434, 91, 'مواد تجميل', 'kakmel-cosmetics', 'example/categories_images/cosmetics.png', '2026-06-16 07:19:29'),
(1435, 91, 'كاميرات', 'kakmel-cameras', 'example/categories_images/cameras.png', '2026-06-16 07:19:29'),
(1436, 91, 'العاب اطفال', 'kakmel-kids-toys', 'example/categories_images/children games.png', '2026-06-16 07:19:29'),
(1437, 91, 'حقائب', 'kakmel-bags', 'example/categories_images/bags.png', '2026-06-16 07:19:29'),
(1438, 91, 'اكسسوارات', 'kakmel-accessories', 'example/categories_images/accessories.png', '2026-06-16 07:19:29');

INSERT INTO coupons (id, store_id, code, discount_value, created_at, discount_type, expiry_date, usage_limit, times_used) VALUES
(151, 89, 'NEW2026', 15.00, '2026-04-23 23:38:01', 'percent', NULL, 50, 0),
(152, 89, 'CASH500', 500.00, '2026-04-23 23:38:01', 'fixed', NULL, 20, 0),
(155, 91, 'NEW2026', 15.00, '2026-06-16 14:19:29', 'percent', NULL, 50, 0),
(156, 91, 'CASH500', 500.00, '2026-06-16 14:19:29', 'fixed', NULL, 20, 0);

INSERT INTO products (id, store_id, title, short_title, short_description, slug, description, price, old_price, cost_price, category_id, is_landing_page, landing_page_image, image_url, gallery_images, variations, offers, created_at, visits_count, status) VALUES
(550, 89, 'كريم مرطب للبشرة', NULL, 'كريم مرطب غني بالفيتامينات والمواد الطبيعية، يمنح بشرتك نضارة وحيوية ونعومة فائقة تدوم طوال اليوم. مناسب لجميع أنواع البشرة ويحميها من الجفاف.', 'kessas-cream', NULL, 2500.00, 3200.00, 1500.00, 1398, false, NULL, 'example/products_images/cream1.png', NULL, NULL, '[{"id":1,"free_shipping":false,"is_best":true,"title":"عرض التوفير: قطعتين","qty":"2","price":"4500","show_badge":true,"badge_color":"#18c8f0","custom_img":false,"image_url":""}]', '2026-04-23 23:38:01', 0, 'active'),
(551, 89, 'أوزان رياضية', NULL, 'أوزان رياضية صلبة ومتينة بتصميم مريح لليد، مانعة للانزلاق. مثالية للتدريبات المنزلية وبناء العضلات بشكل احترافي وآمن.', 'kessas-dumbbell', NULL, 4000.00, 5500.00, 2800.00, 1394, false, NULL, 'example/products_images/dumbbell1.png', NULL, NULL, NULL, '2026-04-23 23:38:01', 0, 'active'),
(552, 89, 'طقم ملابس رجالي', NULL, 'طقم رجالي متكامل بتصميم عصري وأنيق، مصنوع من خامات قطنية عالية الجودة ليوفر لك الراحة التامة والمظهر الجذاب في خروجاتك اليومية.', 'kessas-m-cloth', NULL, 6500.00, 8500.00, 5000.00, 1388, false, NULL, 'example/products_images/men clothing1.png', NULL, '{"attributes":{"1":{"name":"المقاس","type":"أزرار نصية","vals":["L","XL"]}},"matrix":{"L":{"price":"6500","qty":"10","sku":"MCL-L","def":true},"XL":{"price":"6500","qty":"8","sku":"MCL-XL","def":false}}}', NULL, '2026-04-23 23:38:01', 0, 'active'),
(553, 89, 'حذاء كلاسيكي', NULL, 'حذاء كلاسيكي راقي من الجلد المريح والمتين، مصمم بعناية ليمنحك الأناقة والراحة الفائقة في المناسبات الرسمية وأوقات العمل الطويلة.', 'kessas-m-shoes', NULL, 5500.00, 7500.00, 4000.00, 1392, false, NULL, 'example/products_images/men shoes1.png', NULL, '{"attributes":{"1":{"name":"المقاس","type":"أزرار نصية","vals":["42","43","44"]}},"matrix":{"42":{"price":"5500","qty":"5","sku":"MSH-42","def":true},"43":{"price":"5500","qty":"7","sku":"MSH-43","def":false},"44":{"price":"5500","qty":"4","sku":"MSH-44","def":false}}}', NULL, '2026-04-23 23:38:01', 0, 'active'),
(554, 89, 'ساعة يد فاخرة', NULL, 'ساعة يد أنيقة بتفاصيل دقيقة ومحرك عالي الجودة. تصميم مقاوم للماء تضفي لمسة من الفخامة والتميز على إطلالتك اليومية.', 'kessas-m-watch', NULL, 8500.00, 12000.00, 5500.00, 1385, false, NULL, 'example/products_images/men watch1.png', NULL, NULL, '[{"id":2,"free_shipping":true,"is_best":true,"title":"توصيل مجاني متضمن","qty":"1","price":"8500","show_badge":true,"badge_color":"#10b981","custom_img":false,"image_url":""}]', '2026-04-23 23:38:01', 0, 'active'),
(555, 89, 'خلاط كهربائي', NULL, 'خلاط كهربائي عملي وقوي بشفرات حادة من الفولاذ المقاوم للصدأ ومحرك عالي الأداء، يسهل عليك تحضير العصائر والصلصات بسرعة وكفاءة.', 'kessas-mixer', NULL, 7800.00, 9500.00, 5000.00, 1396, false, NULL, 'example/products_images/mixer1.png', NULL, NULL, NULL, '2026-04-23 23:38:01', 0, 'active'),
(556, 89, 'هاتف ذكي', NULL, 'هاتف ذكي بأحدث التقنيات، يتميز بشاشة واضحة عالية الدقة، بطارية تدوم طويلاً، وكاميرا ممتازة لالتقاط أجمل اللحظات وأداء سريع وسلس.', 'kessas-phone', NULL, 45000.00, 52000.00, 38000.00, 1386, false, NULL, 'example/products_images/smart phone1.png', NULL, '{"attributes":{"1":{"name":"اللون","type":"أزرار لون","vals":["#000000","#ffffff"]}},"matrix":{"#000000":{"price":"45000","qty":"10","sku":"PHONE-BLK","def":true},"#ffffff":{"price":"45000","qty":"15","sku":"PHONE-WHT","def":false}}}', NULL, '2026-04-23 23:38:01', 0, 'active'),
(557, 89, 'ملابس نسائية', NULL, 'أزياء نسائية محتشمة وأنيقة، مصممة بخامات مريحة ومناسبة لتلبية احتياجاتك وإبراز إطلالتك الراقية في مختلف المناسبات.', 'kessas-w-cloth', NULL, 5200.00, 6800.00, 3000.00, 1389, false, NULL, 'example/products_images/woman clothing1.png', '[]', '{"attributes":{"1":{"name":"المقاس","type":"أزرار نصية","vals":["M","L"]},"2":{"name":"اللون","type":"أزرار لون","vals":["#ff0000","#000000"]}},"matrix":{"M - #ff0000":{"price":"5200","qty":"5","sku":"DRS-M-RED","def":true},"M - #000000":{"price":"5200","qty":"3","sku":"DRS-M-BLK","def":false},"L - #ff0000":{"price":"5200","qty":"4","sku":"DRS-L-RED","def":false},"L - #000000":{"price":"5200","qty":"6","sku":"DRS-L-BLK","def":false}}}', '[]', '2026-04-23 23:38:01', 2, 'active'),
(566, 91, 'كريم مرطب للبشرة', NULL, 'كريم مرطب غني بالفيتامينات والمواد الطبيعية، يمنح بشرتك نضارة وحيوية ونعومة فائقة تدوم طوال اليوم. مناسب لجميع أنواع البشرة ويحميها من الجفاف.', 'kakmel-cream', NULL, 2500.00, 3200.00, 1500.00, 1434, false, NULL, 'example/products_images/cream1.png', NULL, NULL, '[{"id":1,"free_shipping":false,"is_best":true,"title":"عرض التوفير: قطعتين","qty":"2","price":"4500","show_badge":true,"badge_color":"#18c8f0","custom_img":false,"image_url":""}]', '2026-06-16 14:19:29', 0, 'active'),
(567, 91, 'أوزان رياضية', NULL, 'أوزان رياضية صلبة ومتينة بتصميم مريح لليد، مانعة للانزلاق. مثالية للتدريبات المنزلية وبناء العضلات بشكل احترافي وآمن.', 'kakmel-dumbbell', NULL, 4000.00, 5500.00, 2800.00, 1430, false, NULL, 'example/products_images/dumbbell1.png', NULL, NULL, NULL, '2026-06-16 14:19:29', 0, 'active'),
(568, 91, 'طقم ملابس رجالي', NULL, 'طقم رجالي متكامل بتصميم عصري وأنيق، مصنوع من خامات قطنية عالية الجودة ليوفر لك الراحة التامة والمظهر الجذاب في خروجاتك اليومية.', 'kakmel-m-cloth', NULL, 6500.00, 8500.00, 5000.00, 1424, false, NULL, 'example/products_images/men clothing1.png', NULL, '{"attributes":{"1":{"name":"المقاس","type":"أزرار نصية","vals":["L","XL"]}},"matrix":{"L":{"price":"6500","qty":"10","sku":"MCL-L","def":true},"XL":{"price":"6500","qty":"8","sku":"MCL-XL","def":false}}}', NULL, '2026-06-16 14:19:29', 0, 'active'),
(569, 91, 'حذاء كلاسيكي', NULL, 'حذاء كلاسيكي راقي من الجلد المريح والمتين، مصمم بعناية ليمنحك الأناقة والراحة الفائقة في المناسبات الرسمية وأوقات العمل الطويلة.', 'kakmel-m-shoes', NULL, 5500.00, 7500.00, 4000.00, 1428, false, NULL, 'example/products_images/men shoes1.png', NULL, '{"attributes":{"1":{"name":"المقاس","type":"أزرار نصية","vals":["42","43","44"]}},"matrix":{"42":{"price":"5500","qty":"5","sku":"MSH-42","def":true},"43":{"price":"5500","qty":"7","sku":"MSH-43","def":false},"44":{"price":"5500","qty":"4","sku":"MSH-44","def":false}}}', NULL, '2026-06-16 14:19:29', 0, 'active'),
(570, 91, 'ساعة يد فاخرة', NULL, 'ساعة يد أنيقة بتفاصيل دقيقة ومحرك عالي الجودة. تصميم مقاوم للماء تضفي لمسة من الفخامة والتميز على إطلالتك اليومية.', 'kakmel-m-watch', NULL, 8500.00, 12000.00, 5500.00, 1421, false, NULL, 'example/products_images/men watch1.png', NULL, NULL, '[{"id":2,"free_shipping":true,"is_best":true,"title":"توصيل مجاني متضمن","qty":"1","price":"8500","show_badge":true,"badge_color":"#10b981","custom_img":false,"image_url":""}]', '2026-06-16 14:19:29', 0, 'active'),
(571, 91, 'خلاط كهربائي', NULL, 'خلاط كهربائي عملي وقوي بشفرات حادة من الفولاذ المقاوم للصدأ ومحرك عالي الأداء، يسهل عليك تحضير العصائر والصلصات بسرعة وكفاءة.', 'kakmel-mixer', NULL, 7800.00, 9500.00, 5000.00, 1432, false, NULL, 'example/products_images/mixer1.png', NULL, NULL, NULL, '2026-06-16 14:19:29', 0, 'active'),
(572, 91, 'هاتف ذكي', NULL, 'هاتف ذكي بأحدث التقنيات، يتميز بشاشة واضحة عالية الدقة، بطارية تدوم طويلاً، وكاميرا ممتازة لالتقاط أجمل اللحظات وأداء سريع وسلس.', 'kakmel-phone', NULL, 45000.00, 52000.00, 38000.00, 1422, false, NULL, 'example/products_images/smart phone1.png', NULL, '{"attributes":{"1":{"name":"اللون","type":"أزرار لون","vals":["#000000","#ffffff"]}},"matrix":{"#000000":{"price":"45000","qty":"10","sku":"PHONE-BLK","def":true},"#ffffff":{"price":"45000","qty":"15","sku":"PHONE-WHT","def":false}}}', NULL, '2026-06-16 14:19:29', 0, 'active'),
(573, 91, 'ملابس نسائية', NULL, 'أزياء نسائية محتشمة وأنيقة، مصممة بخامات مريحة ومناسبة لتلبية احتياجاتك وإبراز إطلالتك الراقية في مختلف المناسبات.', 'kakmel-w-cloth', NULL, 5200.00, 6800.00, 3000.00, 1425, false, NULL, 'example/products_images/woman clothing1.png', NULL, '{"attributes":{"1":{"name":"المقاس","type":"أزرار نصية","vals":["M","L"]},"2":{"name":"اللون","type":"أزرار لون","vals":["#ff0000","#000000"]}},"matrix":{"M - #ff0000":{"price":"5200","qty":"5","sku":"DRS-M-RED","def":true},"M - #000000":{"price":"5200","qty":"3","sku":"DRS-M-BLK","def":false},"L - #ff0000":{"price":"5200","qty":"4","sku":"DRS-L-RED","def":false},"L - #000000":{"price":"5200","qty":"6","sku":"DRS-L-BLK","def":false}}}', NULL, '2026-06-16 14:19:29', 0, 'active');

INSERT INTO orders (id, store_id, product_id, customer_name, phone, state, municipality, status, created_at, phone_status, delivery_status, quantity, total_price, cart_data) VALUES
(116, 89, 557, 'Djillali Kessas', '0658094184', '07 - بسكرة', 'مشونش - [توصيل للمنزل]', 'pending', '2026-04-23 23:39:35', 'ملغى', 'مستلم', 1, 5800.00, '[{"id":"557-2KfZhNmF2YLYp9izOiBNIC0g2KfZhNmE2YjZhjogI2ZmMDAwMA==","original_id":557,"title":"ملابس نسائية","price":5200,"image":"example/products_images/woman clothing1.png","quantity":1,"variations":{"المقاس":"M","اللون":"#ff0000"},"offer_id":null,"offer_title":null,"free_shipping":false}]');

INSERT INTO site_visits (visit_date, store_id, visits_count) VALUES
('2026-04-23', 89, 1);

INSERT INTO user_messages (id, user_id, message, has_button, button_title, button_link, created_at) VALUES
(34, 89, 'اهلا بيك', true, 'انقر هنا', 'https://bacaloria.vercel.app/', '2026-05-06 05:57:29');
