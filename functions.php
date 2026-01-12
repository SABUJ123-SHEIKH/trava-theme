<?php
if (!defined('ABSPATH')) {
  exit;
}

require_once get_template_directory() . '/inc/branding.php';
require_once get_template_directory() . '/inc/renders.php';

add_action('after_setup_theme', 'trava_setup_theme');
function trava_setup_theme() {
  add_theme_support('title-tag');
  add_theme_support('editor-styles');
  add_theme_support('wp-block-styles');
}

add_filter('block_categories_all', 'trava_register_block_category', 10, 2);
add_action('init', 'trava_register_trava_blocks');
function trava_register_trava_blocks() {
  trava_register_editor_script();

  foreach (trava_block_definitions() as $block) {
    trava_register_block($block['name'], $block['render'], $block['attributes']);
  }

  trava_register_block_patterns();
}

function trava_block_definitions() {
  return [
    [
      'name' => 'trava/hero',
      'render' => 'trava_render_hero',
      'attributes' => [
        'heading' => ['type' => 'string', 'default' => 'Accounting Redefined For Growth'],
        'subheading' => ['type' => 'string', 'default' => 'TravAccount helps startups, freelancers, and small businesses stay compliant, make smarter financial decisions, and save valuable time.'],
        'ctaText' => ['type' => 'string', 'default' => 'Book a Free Consultation'],
        'ctaUrl' => ['type' => 'string', 'default' => '#'],
        'imageUrl' => ['type' => 'string', 'default' => ''],
        'bgColor' => ['type' => 'string', 'default' => '#0F160C'],
        'padY' => ['type' => 'number', 'default' => 72],
        'textColor' => ['type' => 'string', 'default' => '#F1F5F9'],
        'subtitleColor' => ['type' => 'string', 'default' => '#ffffff'],
        'highlightText' => ['type' => 'string', 'default' => 'Redefined'],
        'highlightColor' => ['type' => 'string', 'default' => '#C9F054'],
        'btnBg' => ['type' => 'string', 'default' => 'rgba(255,255,255,.25)'],
        'btnTextColor' => ['type' => 'string', 'default' => '#F8FAFC'],
        'btnIconBg' => ['type' => 'string', 'default' => '#BBF451'],
        'btnIconColor' => ['type' => 'string', 'default' => '#020618'],
        'btnIconType' => ['type' => 'string', 'default' => 'icomoon'],
        'btnIconClass' => ['type' => 'string', 'default' => 'icon-ablocks-arrow-right'],
        'btnIconImage' => ['type' => 'string', 'default' => ''],
        'textAnim' => ['type' => 'string', 'default' => 'none'],
        'textAnimTrigger' => ['type' => 'string', 'default' => 'scroll'],
      ],
    ],
    [
      'name' => 'trava/header',
      'render' => 'trava_render_header',
      'attributes' => [
        'logoUrl' => ['type' => 'string', 'default' => ''],
        'logoLink' => ['type' => 'string', 'default' => '#'],
        'navItems' => ['type' => 'array', 'default' => [
          ['label' => 'Home', 'url' => '#home'],
          ['label' => 'Services', 'url' => '#services'],
          ['label' => 'Testimonials', 'url' => '#testimonials'],
          ['label' => 'CTA', 'url' => '#cta'],
          ['label' => 'Contact', 'url' => '#contact'],
        ]],
        'navCtaText' => ['type' => 'string', 'default' => "Let's Talk"],
        'navCtaUrl' => ['type' => 'string', 'default' => '#'],
        'navCtaShow' => ['type' => 'boolean', 'default' => true],
        'navCtaHideMobile' => ['type' => 'boolean', 'default' => false],
        'navCtaIconType' => ['type' => 'string', 'default' => 'icomoon'],
        'navCtaIconClass' => ['type' => 'string', 'default' => 'icon-ablocks-plus'],
        'navCtaIconImage' => ['type' => 'string', 'default' => ''],
        'bgColor' => ['type' => 'string', 'default' => '#0F160C'],
        'padY' => ['type' => 'number', 'default' => 24],
        'textColor' => ['type' => 'string', 'default' => '#F1F5F9'],
        'textAnim' => ['type' => 'string', 'default' => 'none'],
        'textAnimTrigger' => ['type' => 'string', 'default' => 'scroll'],
      ],
    ],
    [
      'name' => 'trava/services',
      'render' => 'trava_render_services',
      'attributes' => [
        'items' => ['type' => 'array', 'default' => [
          ['iconType' => 'icomoon', 'iconClass' => 'icon-ablocks-briefcase', 'iconImage' => '', 'title' => 'Bookkeeping', 'text' => 'Accurate and timely bookkeeping services to keep your financial records organized and up-to-date.'],
          ['iconType' => 'icomoon', 'iconClass' => 'icon-ablocks-wallet', 'iconImage' => '', 'title' => 'Payroll Management', 'text' => 'Efficient payroll processing to ensure your employees are paid accurately and on time.'],
          ['iconType' => 'icomoon', 'iconClass' => 'icon-ablocks-calculator', 'iconImage' => '', 'title' => 'Tax Planning', 'text' => 'Strategic tax planning to minimize your tax liabilities and maximize your savings.'],
          ['iconType' => 'icomoon', 'iconClass' => 'icon-ablocks-shield', 'iconImage' => '', 'title' => 'Audit Services', 'text' => 'Thorough audit services to ensure compliance and identify areas for improvement.'],
        ]],
        'sideTitle' => ['type' => 'string', 'default' => 'Start your growth Journey'],
        'sideCtaText' => ['type' => 'string', 'default' => 'Get in Touch'],
        'sideCtaUrl' => ['type' => 'string', 'default' => '#'],
        'sideImage' => ['type' => 'string', 'default' => ''],
        'bgColor' => ['type' => 'string', 'default' => '#FEFFFA'],
        'padY' => ['type' => 'number', 'default' => 80],
        'textColor' => ['type' => 'string', 'default' => 'inherit'],
        'cardBg' => ['type' => 'string', 'default' => '#ffffff'],
        'cardBorder' => ['type' => 'string', 'default' => '#D1D5DC'],
        'cardTitleColor' => ['type' => 'string', 'default' => '#222222'],
        'cardTextColor' => ['type' => 'string', 'default' => '#474747'],
        'cardIconBg' => ['type' => 'string', 'default' => '#c3f53c'],
        'cardIconColor' => ['type' => 'string', 'default' => '#0F160C'],
        'textAnim' => ['type' => 'string', 'default' => 'none'],
        'textAnimTrigger' => ['type' => 'string', 'default' => 'scroll'],
      ],
    ],
    [
      'name' => 'trava/testimonials',
      'render' => 'trava_render_testimonials',
      'attributes' => [
        'kicker' => ['type' => 'string', 'default' => 'Testimonials'],
        'title' => ['type' => 'string', 'default' => 'Hear people say and reveal our finest services'],
        'items' => ['type' => 'array', 'default' => [
          ['brand' => 'stripe', 'name' => 'Oliver Davies', 'company' => 'Travacount PLC', 'text' => 'TravAccounting has been instrumental in helping our business navigate complex tax regulations.', 'image' => ''],
          ['brand' => '', 'name' => 'Oliver Davies', 'company' => 'Hexatech', 'text' => 'Their expertise and attention to detail have saved us both time and money.', 'image' => ''],
        ]],
        'bgColor' => ['type' => 'string', 'default' => '#F4F4F5'],
        'padY' => ['type' => 'number', 'default' => 72],
        'textColor' => ['type' => 'string', 'default' => 'inherit'],
        'sliderLoop' => ['type' => 'boolean', 'default' => true],
        'sliderSpeed' => ['type' => 'number', 'default' => 600],
        'sliderSpace' => ['type' => 'number', 'default' => 24],
        'sliderAutoplay' => ['type' => 'boolean', 'default' => false],
        'sliderDelay' => ['type' => 'number', 'default' => 5000],
        'sliderDots' => ['type' => 'boolean', 'default' => true],
        'sliderArrows' => ['type' => 'boolean', 'default' => true],
        'textAnim' => ['type' => 'string', 'default' => 'none'],
        'textAnimTrigger' => ['type' => 'string', 'default' => 'scroll'],
      ],
    ],
    [
      'name' => 'trava/cta',
      'render' => 'trava_render_cta',
      'attributes' => [
        'heading' => ['type' => 'string', 'default' => 'Ready to simplify your accounting?'],
        'text' => ['type' => 'string', 'default' => 'Let TravAccount handle your finances while you focus on growing your business with confidence.'],
        'ctaText' => ['type' => 'string', 'default' => 'Get Started Today'],
        'ctaUrl' => ['type' => 'string', 'default' => '#'],
        'bgImage' => ['type' => 'string', 'default' => ''],
        'padB' => ['type' => 'number', 'default' => 80],
        'textColor' => ['type' => 'string', 'default' => '#ffffff'],
        'btnBg' => ['type' => 'string', 'default' => 'rgba(255,255,255,.6)'],
        'btnTextColor' => ['type' => 'string', 'default' => '#101828'],
        'btnIconBg' => ['type' => 'string', 'default' => '#c9f054'],
        'btnIconColor' => ['type' => 'string', 'default' => '#020618'],
        'btnIconType' => ['type' => 'string', 'default' => 'icomoon'],
        'btnIconClass' => ['type' => 'string', 'default' => 'icon-ablocks-arrow-right'],
        'btnIconImage' => ['type' => 'string', 'default' => ''],
        'textAnim' => ['type' => 'string', 'default' => 'none'],
        'textAnimTrigger' => ['type' => 'string', 'default' => 'scroll'],
      ],
    ],
    [
      'name' => 'trava/footer',
      'render' => 'trava_render_footer',
      'attributes' => [
        'brandText' => ['type' => 'string', 'default' => 'TravAccount'],
        'aboutText' => ['type' => 'string', 'default' => 'We are dedicated financial experts, providing top-notch accounting services to businesses of all sizes.'],
        'supportText' => ['type' => 'string', 'default' => 'Our Support and Sales team is available 24/7 to answer your queries'],
        'address' => ['type' => 'string', 'default' => '123 Main St, Suite 500, London, UK'],
        'phone' => ['type' => 'string', 'default' => '01571273741'],
        'navTitle' => ['type' => 'string', 'default' => 'Navigation'],
        'navLinks' => ['type' => 'array', 'default' => [
          ['label' => 'Home', 'url' => '#home'],
          ['label' => 'About Us', 'url' => '#'],
          ['label' => 'Our Services', 'url' => '#services'],
          ['label' => 'Our Team', 'url' => '#'],
        ]],
        'servicesTitle' => ['type' => 'string', 'default' => 'Services'],
        'servicesLinks' => ['type' => 'array', 'default' => [
          ['label' => 'Bookkeeping', 'url' => '#'],
          ['label' => 'VAT Returns', 'url' => '#'],
          ['label' => 'Payroll Management', 'url' => '#'],
          ['label' => 'Tax Preparation', 'url' => '#'],
        ]],
        'contactTitle' => ['type' => 'string', 'default' => 'Contact Us'],
        'bottomLeft' => ['type' => 'string', 'default' => 'Copyright © 2025 TravAccount • Design by Zayd'],
        'bottomRight' => ['type' => 'string', 'default' => 'Terms of Use • Privacy Policy'],
        'twitterUrl' => ['type' => 'string', 'default' => '#'],
        'instagramUrl' => ['type' => 'string', 'default' => '#'],
        'youtubeUrl' => ['type' => 'string', 'default' => '#'],
        'bgColor' => ['type' => 'string', 'default' => '#0F160C'],
        'textColor' => ['type' => 'string', 'default' => '#DAE2EC'],
        'headingColor' => ['type' => 'string', 'default' => '#ffffff'],
        'linkColor' => ['type' => 'string', 'default' => '#DAE2EC'],
        'linkHoverColor' => ['type' => 'string', 'default' => '#C9F054'],
        'socialBg' => ['type' => 'string', 'default' => '#C9F054'],
        'socialColor' => ['type' => 'string', 'default' => '#020618'],
        'socialHoverBg' => ['type' => 'string', 'default' => '#E7FF80'],
        'socialHoverColor' => ['type' => 'string', 'default' => '#0F160C'],
        'borderColor' => ['type' => 'string', 'default' => 'rgba(218,226,236,.2)'],
        'topGap' => ['type' => 'number', 'default' => 32],
        'topGapDesktop' => ['type' => 'number', 'default' => 80],
        'colsGap' => ['type' => 'number', 'default' => 24],
        'bottomGap' => ['type' => 'number', 'default' => 24],
        'linkGap' => ['type' => 'number', 'default' => 6],
        'padY' => ['type' => 'number', 'default' => 48],
        'textAnim' => ['type' => 'string', 'default' => 'none'],
        'textAnimTrigger' => ['type' => 'string', 'default' => 'scroll'],
      ],
    ],
  ];
}

function trava_register_block_category($categories, $post) {
  $categories[] = ['slug' => 'trava-blocks', 'title' => 'Trava Blocks'];
  return $categories;
}

function trava_register_block($name, $render_callback, $attributes) {
  register_block_type($name, [
    'editor_script' => 'trava-blocks-editor',
    'render_callback' => $render_callback,
    'attributes' => $attributes,
  ]);
}

function trava_register_editor_script() {
  $editor_js_ver = filemtime(get_template_directory() . '/assets/js/blocks.js');
  wp_register_script(
    'trava-blocks-editor',
    get_template_directory_uri() . '/assets/js/blocks.js',
    ['wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n', 'wp-editor'],
    $editor_js_ver,
    true
  );
}

function trava_register_block_patterns() {
  if (!function_exists('register_block_pattern')) {
    return;
  }

  register_block_pattern('trava/landing-page', [
    'title' => 'Trava Landing Page',
    'categories' => ['pages'],
    'content' =>
    '<!-- wp:trava/header /-->'.
      '<!-- wp:trava/hero /-->' .
      '<!-- wp:trava/services /-->' .
      '<!-- wp:trava/testimonials /-->' .
      '<!-- wp:trava/cta /-->' .
      '<!-- wp:trava/footer /-->',
  ]);
}

function trava_enqueue_fontawesome() {
  $fontawesome_path = WP_PLUGIN_DIR . '/ablocks/assets/library/font-awesome/css/all.min.css';
  if (file_exists($fontawesome_path)) {
    wp_enqueue_style(
      'trava-fontawesome',
      plugins_url('ablocks/assets/library/font-awesome/css/all.min.css'),
      [],
      '5.15.4'
    );
  }
}

function trava_enqueue_google_font() {
  $font_url = trava_get_google_font_url();
  if ($font_url) {
    wp_enqueue_style('trava-google-font', $font_url, [], null);
  }
}

add_action('wp_enqueue_scripts', 'trava_enqueue_frontend_assets', 20);
function trava_enqueue_frontend_assets() {
  trava_enqueue_fontawesome();

  $frontend_css_version = filemtime(get_template_directory() . '/assets/css/frontend.css');
  $icomoon_css_version = filemtime(get_template_directory() . '/assets/icomoon/style.css');
  wp_enqueue_style('trava-frontend', get_template_directory_uri() . '/assets/css/frontend.css', [], $frontend_css_version);
  wp_enqueue_style('trava-icomoon', get_template_directory_uri() . '/assets/icomoon/style.css', [], $icomoon_css_version);
  wp_add_inline_style('trava-frontend', trava_get_branding_css_vars());

  trava_enqueue_google_font();

  wp_enqueue_style('trava-swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', [], '11');
  wp_enqueue_script('trava-swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', [], '11', true);
  wp_enqueue_script('trava-gsap', 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js', [], '3', true);
  wp_enqueue_script('trava-scrolltrigger', 'https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js', ['trava-gsap'], '3', true);

  $frontend_js_version = filemtime(get_template_directory() . '/assets/js/frontend.js');
  wp_enqueue_script(
    'trava-frontend-js',
    get_template_directory_uri() . '/assets/js/frontend.js',
    ['trava-swiper', 'trava-scrolltrigger'],
    $frontend_js_version,
    true
  );
}

add_action('enqueue_block_editor_assets', 'trava_enqueue_editor_assets', 20);
function trava_enqueue_editor_assets() {
  trava_enqueue_fontawesome();

  $frontend_css_version = filemtime(get_template_directory() . '/assets/css/frontend.css');
  $editor_css_version = filemtime(get_template_directory() . '/assets/css/editor.css');
  $icomoon_css_version = filemtime(get_template_directory() . '/assets/icomoon/style.css');
  wp_enqueue_style('trava-frontend', get_template_directory_uri() . '/assets/css/frontend.css', [], $frontend_css_version);
  wp_enqueue_style('trava-editor', get_template_directory_uri() . '/assets/css/editor.css', [], $editor_css_version);
  wp_enqueue_style('trava-icomoon', get_template_directory_uri() . '/assets/icomoon/style.css', [], $icomoon_css_version);
  wp_add_inline_style('trava-editor', trava_get_branding_css_vars());

  wp_enqueue_script('trava-blocks-editor');

  trava_enqueue_google_font();

  $inline_images_script = 'window.travaThemeData = window.travaThemeData || {};' .
    'window.travaThemeData.images = {' .
    'hero:"' . get_template_directory_uri() . '/assets/images/hero.png",' .
    'logo:"' . get_template_directory_uri() . '/assets/images/logo.png",' .
    'serviceSide:"' . get_template_directory_uri() . '/assets/images/service-side.png",' .
    'ctaBg:"' . get_template_directory_uri() . '/assets/images/cta-bg.png",' .
    'test1:"' . get_template_directory_uri() . '/assets/images/testimonial-1.png"' .
    '};';

  wp_add_inline_script('trava-blocks-editor', $inline_images_script, 'before');
}
