<?php
if (!defined('ABSPATH')) {
  exit;
}

function trava_branding_defaults() {
  return [
    'primary_color' => '#101828',
    'button_color' => '#c9f054',
    'accent_color' => '#c3f53c',
    'font_family' => 'Inter',
    'font_size' => 16,
    'container' => 1280,
  ];
}

function trava_branding_font_options() {
  return ['System', 'Inter', 'Instrument Sans', 'Poppins', 'Roboto', 'Montserrat', 'Nunito', 'Open Sans', 'Lato'];
}

function trava_branding_google_fonts() {
  return ['Inter', 'Instrument Sans', 'Poppins', 'Roboto', 'Montserrat', 'Nunito', 'Open Sans', 'Lato'];
}

function trava_get_branding() {
  $branding_options = get_option('trava_branding', []);
  if (!is_array($branding_options)) {
    $branding_options = [];
  }
  return array_merge(trava_branding_defaults(), $branding_options);
}

function trava_get_google_font_url() {
  $branding = trava_get_branding();
  $font_family = trim($branding['font_family'] ?? '');
  if ($font_family === '' || strtolower($font_family) === 'system') {
    return '';
  }

  $allowed_fonts = trava_branding_google_fonts();
  if (!in_array($font_family, $allowed_fonts, true)) {
    return '';
  }

  $family_slug = str_replace(' ', '+', $font_family);
  return 'https://fonts.googleapis.com/css2?family=' . $family_slug . ':wght@300;400;500;600;700&display=swap';
}

function trava_get_branding_css_vars() {
  $branding = trava_get_branding();
  $font_family = $branding['font_family'] ?? 'Inter';
  $font_stack = ($font_family && strtolower($font_family) !== 'system')
    ? "'" . esc_html($font_family) . "', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    : 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

  return ':root{'
    . '--trava-primary:' . esc_html($branding['primary_color']) . ';'
    . '--trava-button:' . esc_html($branding['button_color']) . ';'
    . '--trava-accent:' . esc_html($branding['accent_color']) . ';'
    . '--trava-font-family:' . $font_stack . ';'
    . '--trava-font-size:' . intval($branding['font_size']) . 'px;'
    . '--trava-container:' . intval($branding['container']) . 'px;'
    . '}';
}

add_action('admin_menu', function () {
  add_menu_page('Branding', 'Branding', 'manage_options', 'trava-branding', 'trava_branding_page', 'dashicons-admin-customizer', 61);
});

add_action('admin_init', function () {
  register_setting('trava_branding_group', 'trava_branding', [
    'sanitize_callback' => 'trava_sanitize_branding',
  ]);
});

function trava_sanitize_branding($input) {
  $defaults = trava_branding_defaults();
  $sanitized = [];

  $sanitized['primary_color'] = isset($input['primary_color'])
    ? sanitize_hex_color($input['primary_color'])
    : $defaults['primary_color'];
  $sanitized['button_color'] = isset($input['button_color'])
    ? sanitize_hex_color($input['button_color'])
    : $defaults['button_color'];
  $sanitized['accent_color'] = isset($input['accent_color'])
    ? sanitize_hex_color($input['accent_color'])
    : $defaults['accent_color'];
  $sanitized['font_family'] = isset($input['font_family'])
    ? sanitize_text_field($input['font_family'])
    : $defaults['font_family'];
  $sanitized['font_size'] = isset($input['font_size'])
    ? max(12, min(24, absint($input['font_size'])))
    : $defaults['font_size'];
  $sanitized['container'] = isset($input['container'])
    ? max(960, min(1440, absint($input['container'])))
    : $defaults['container'];

  return $sanitized;
}

function trava_branding_page() {
  $branding = trava_get_branding();
  $font_options = trava_branding_font_options();
  ?>
  <div class="wrap">
    <h1>Branding</h1>
    <form method="post" action="options.php">
      <?php settings_fields('trava_branding_group'); ?>
      <table class="form-table" role="presentation">
        <tr>
          <th>Primary Color</th>
          <td><input name="trava_branding[primary_color]" value="<?php echo esc_attr($branding['primary_color']); ?>" type="text" class="regular-text"/></td>
        </tr>
        <tr>
          <th>Button Color</th>
          <td><input name="trava_branding[button_color]" value="<?php echo esc_attr($branding['button_color']); ?>" type="text" class="regular-text"/></td>
        </tr>
        <tr>
          <th>Accent Color</th>
          <td><input name="trava_branding[accent_color]" value="<?php echo esc_attr($branding['accent_color']); ?>" type="text" class="regular-text"/></td>
        </tr>
        <tr>
          <th>Google Font</th>
          <td>
            <select name="trava_branding[font_family]">
              <?php foreach ($font_options as $font_option): ?>
                <option value="<?php echo esc_attr($font_option); ?>" <?php selected($branding['font_family'], $font_option); ?>><?php echo esc_html($font_option); ?></option>
              <?php endforeach; ?>
            </select>
          </td>
        </tr>
        <tr>
          <th>Base Font Size</th>
          <td><input name="trava_branding[font_size]" value="<?php echo esc_attr($branding['font_size']); ?>" type="number" min="12" max="24"/> px</td>
        </tr>
        <tr>
          <th>Container Width</th>
          <td><input name="trava_branding[container]" value="<?php echo esc_attr($branding['container']); ?>" type="number" min="960" max="1440"/> px</td>
        </tr>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <?php
}

add_action('wp_enqueue_scripts', 'trava_enqueue_branding_font', 5);
function trava_enqueue_branding_font() {
  if (function_exists('trava_enqueue_google_font')) {
    trava_enqueue_google_font();
  }
}
