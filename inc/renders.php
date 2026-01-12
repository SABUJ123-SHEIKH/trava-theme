<?php
if (!defined('ABSPATH')) {
  exit;
}

function trava_img($name) {
  return get_template_directory_uri() . '/assets/images/' . $name;
}

function trava_default_nav_items() {
  return [
    ['label' => 'Home', 'url' => '#home'],
    ['label' => 'Services', 'url' => '#services'],
    ['label' => 'Testimonials', 'url' => '#testimonials'],
    ['label' => 'CTA', 'url' => '#cta'],
    ['label' => 'Contact', 'url' => '#contact'],
  ];
}

function trava_render_icon($icon_type, $icon_class, $image_url, $alt_text = '') {
  if ($icon_type === 'image' && !empty($image_url)) {
    return '<img class="trava-icon-img" src="' . esc_url($image_url) . '" alt="' . esc_attr($alt_text) . '">';
  }
  return '<span class="' . esc_attr($icon_class) . '"></span>';
}

function trava_text_anim_attr($attributes) {
  $animation = $attributes['textAnim'] ?? 'none';
  if ($animation === 'none' || $animation === '') {
    return '';
  }
  $animation_trigger = $attributes['textAnimTrigger'] ?? 'scroll';
  return ' data-animate="' . esc_attr($animation) . '" data-animate-trigger="' . esc_attr($animation_trigger) . '"';
}

function trava_build_hero_heading($heading, $highlight_text) {
  $escaped_heading = esc_html($heading);
  $heading_markup = $escaped_heading;

  $highlight_text = trim($highlight_text);
  if ($highlight_text !== '') {
    $escaped_highlight = esc_html($highlight_text);
    $highlighted_heading = str_ireplace(
      $escaped_highlight,
      '<span class="trava-hero__title-highlight">' . $escaped_highlight . '</span>',
      $escaped_heading
    );
    if ($highlighted_heading !== $escaped_heading) {
      $heading_markup = $highlighted_heading;
    }
  }

  if ($heading_markup === $escaped_heading) {
    $heading_markup = preg_replace(
      '/^(\\S+\\s+)(\\S+)/',
      '$1<span class="trava-hero__title-highlight">$2</span>',
      $escaped_heading,
      1
    );
  }

  return wp_kses($heading_markup, ['span' => ['class' => true]]);
}

function trava_render_header($attributes) {
  $background_color = $attributes['bgColor'] ?? '#0F160C';
  $vertical_padding = intval($attributes['padY'] ?? 24);
  $text_color = $attributes['textColor'] ?? '#F1F5F9';
  $logo_url = !empty($attributes['logoUrl']) ? esc_url($attributes['logoUrl']) : trava_img('logo.png');
  $logo_link = $attributes['logoLink'] ?? '#';
  $nav_items = is_array($attributes['navItems'] ?? null) ? $attributes['navItems'] : [];
  if (empty($nav_items)) {
    $nav_items = trava_default_nav_items();
  }

  $nav_cta_text = $attributes['navCtaText'] ?? '';
  $nav_cta_url = $attributes['navCtaUrl'] ?? '#';
  $nav_cta_show = isset($attributes['navCtaShow']) ? (bool) $attributes['navCtaShow'] : true;
  $nav_cta_hide_mobile = isset($attributes['navCtaHideMobile']) ? (bool) $attributes['navCtaHideMobile'] : false;
  $nav_cta_icon_type = $attributes['navCtaIconType'] ?? 'icomoon';
  $nav_cta_icon_class = $attributes['navCtaIconClass'] ?? 'icon-ablocks-plus';
  $nav_cta_icon_image = $attributes['navCtaIconImage'] ?? '';

  $inline_style = sprintf(
    'background:%s;padding:%dpx 0;--trava-header-text:%s;',
    esc_attr($background_color),
    $vertical_padding,
    esc_attr($text_color)
  );

  ob_start(); ?>
  <header id="site-header" class="trava-header trava-animate" style="<?php echo $inline_style; ?>"<?php echo trava_text_anim_attr($attributes); ?>>
    <div class="trava-container">
      <div class="trava-header__nav">
        <div class="trava-brand">
          <a href="<?php echo esc_url($logo_link); ?>" aria-label="Home">
            <img src="<?php echo esc_url($logo_url); ?>" alt="">
          </a>
        </div>
        <button class="trava-mobile-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
          <span class="icon-ablocks-menu"></span>
        </button>
        <?php if (!empty($nav_items)): ?>
          <nav class="trava-navpill" aria-label="Primary">
            <button class="trava-navpill__close" type="button" aria-label="Close menu">
              <span class="icon-ablocks-plus"></span>
            </button>
            <ul class="trava-navpill__list">
              <?php foreach ($nav_items as $nav_item):
                $item_label = $nav_item['label'] ?? '';
                $item_url = $nav_item['url'] ?? '#';
                if ($item_label === '') {
                  continue;
                }
              ?>
                <li><a href="<?php echo esc_url($item_url); ?>"><?php echo esc_html($item_label); ?></a></li>
              <?php endforeach; ?>
            </ul>
          </nav>
        <?php endif; ?>
        <?php if ($nav_cta_show && $nav_cta_text !== ''): ?>
          <a class="trava-btn trava-btn--nav<?php echo $nav_cta_hide_mobile ? ' trava-btn--nav-hide-mobile' : ''; ?>" href="<?php echo esc_url($nav_cta_url); ?>">
            <span><?php echo esc_html($nav_cta_text); ?></span>
            <span class="trava-btn__icon"><?php echo trava_render_icon($nav_cta_icon_type, $nav_cta_icon_class, $nav_cta_icon_image, ''); ?></span>
          </a>
        <?php endif; ?>
      </div>
    </div>
  </header>
  <?php return ob_get_clean();
}

function trava_render_hero($attributes) {
  $heading = $attributes['heading'] ?? '';
  $subheading = $attributes['subheading'] ?? '';
  $cta_text = $attributes['ctaText'] ?? '';
  $cta_url = $attributes['ctaUrl'] ?? '#';
  $hero_image_url = !empty($attributes['imageUrl']) ? esc_url($attributes['imageUrl']) : trava_img('hero.png');
  $background_color = $attributes['bgColor'] ?? '#0F160C';
  $vertical_padding = intval($attributes['padY'] ?? 72);

  $button_icon_type = $attributes['btnIconType'] ?? 'icomoon';
  $button_icon_class = $attributes['btnIconClass'] ?? 'icon-ablocks-arrow-right';
  $button_icon_image = $attributes['btnIconImage'] ?? '';

  $inline_style = sprintf(
    'background:%s;padding:%dpx 0;--trava-hero-text:%s;--trava-hero-subtitle:%s;--trava-hero-highlight:%s;--trava-hero-btn-bg:%s;--trava-hero-btn-text:%s;--trava-hero-btn-icon-bg:%s;--trava-hero-btn-icon-color:%s;',
    esc_attr($background_color),
    $vertical_padding,
    esc_attr($attributes['textColor'] ?? '#F1F5F9'),
    esc_attr($attributes['subtitleColor'] ?? '#ffffff'),
    esc_attr($attributes['highlightColor'] ?? '#C9F054'),
    esc_attr($attributes['btnBg'] ?? 'rgba(255,255,255,.25)'),
    esc_attr($attributes['btnTextColor'] ?? '#F8FAFC'),
    esc_attr($attributes['btnIconBg'] ?? '#BBF451'),
    esc_attr($attributes['btnIconColor'] ?? '#020618')
  );

  $heading_markup = trava_build_hero_heading($heading, $attributes['highlightText'] ?? '');

  ob_start(); ?>
  <section id="home" class="trava-hero trava-animate" style="<?php echo $inline_style; ?>"<?php echo trava_text_anim_attr($attributes); ?>>
    <div class="trava-container">
      <div class="trava-hero__grid">
        <div>
          <h1 class="trava-hero__title"><?php echo $heading_markup; ?></h1>
          <p class="trava-hero__subtitle"><?php echo esc_html($subheading); ?></p>
          <a class="trava-btn" href="<?php echo esc_url($cta_url); ?>">
            <?php echo esc_html($cta_text); ?>
            <span class="trava-btn__icon"><?php echo trava_render_icon($button_icon_type, $button_icon_class, $button_icon_image, ''); ?></span>
          </a>
        </div>
        <div class="trava-hero__media"><img src="<?php echo esc_url($hero_image_url); ?>" alt=""></div>
      </div>
    </div>
  </section>
  <?php return ob_get_clean();
}

function trava_render_services($attributes) {
  $items = is_array($attributes['items'] ?? null) ? $attributes['items'] : [];
  $side_image_url = !empty($attributes['sideImage']) ? esc_url($attributes['sideImage']) : trava_img('service-side.png');
  $background_color = $attributes['bgColor'] ?? '#FEFFFA';
  $vertical_padding = intval($attributes['padY'] ?? 80);

  $inline_style = sprintf(
    'background:%s;padding:%dpx 0;--trava-services-text:%s;--trava-card-bg:%s;--trava-card-border:%s;--trava-card-title:%s;--trava-card-text:%s;--trava-card-icon-bg:%s;--trava-card-icon-color:%s;',
    esc_attr($background_color),
    $vertical_padding,
    esc_attr($attributes['textColor'] ?? 'inherit'),
    esc_attr($attributes['cardBg'] ?? '#ffffff'),
    esc_attr($attributes['cardBorder'] ?? '#D1D5DC'),
    esc_attr($attributes['cardTitleColor'] ?? '#222222'),
    esc_attr($attributes['cardTextColor'] ?? '#474747'),
    esc_attr($attributes['cardIconBg'] ?? 'var(--trava-accent)'),
    esc_attr($attributes['cardIconColor'] ?? '#0F160C')
  );

  ob_start(); ?>
  <section id="services" class="trava-services trava-animate" style="<?php echo $inline_style; ?>"<?php echo trava_text_anim_attr($attributes); ?>>
    <div class="trava-container">
      <div class="trava-services__grid">
        <div class="trava-services__cards">
          <?php foreach ($items as $item):
            $icon_type = $item['iconType'] ?? 'icomoon';
            $icon_class = $item['iconClass'] ?? 'icon-ablocks-briefcase';
            $icon_image = $item['iconImage'] ?? '';
            $title = $item['title'] ?? '';
            $description = $item['text'] ?? '';
          ?>
          <article class="trava-card">
            <div class="trava-card__icon"><?php echo trava_render_icon($icon_type, $icon_class, $icon_image, $title); ?></div>
            <h3 class="trava-card__title"><?php echo esc_html($title); ?></h3>
            <p class="trava-card__text"><?php echo esc_html($description); ?></p>
          </article>
          <?php endforeach; ?>
        </div>
        <aside class="trava-services__side">
          <img src="<?php echo esc_url($side_image_url); ?>" alt="">
          <div class="trava-side__cta">
            <h3><?php echo esc_html($attributes['sideTitle'] ?? 'Start your growth Journey'); ?></h3>
            <a class="trava-btn trava-btn--light" href="<?php echo esc_url($attributes['sideCtaUrl'] ?? '#'); ?>">
              <?php echo esc_html($attributes['sideCtaText'] ?? 'Get in Touch'); ?>
              <span class="trava-btn__icon"><?php echo trava_render_icon('icomoon', 'icon-ablocks-arrow-right', ''); ?></span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  </section>
  <?php return ob_get_clean();
}

function trava_render_testimonials($attributes) {
  $items = is_array($attributes['items'] ?? null) ? $attributes['items'] : [];
  $background_color = $attributes['bgColor'] ?? '#F4F4F5';
  $vertical_padding = intval($attributes['padY'] ?? 72);
  $slider_loop_enabled = isset($attributes['sliderLoop']) ? (bool) $attributes['sliderLoop'] : true;
  $slider_speed = intval($attributes['sliderSpeed'] ?? 600);
  $slider_space = intval($attributes['sliderSpace'] ?? 24);
  $slider_autoplay_enabled = isset($attributes['sliderAutoplay']) ? (bool) $attributes['sliderAutoplay'] : false;
  $slider_delay = intval($attributes['sliderDelay'] ?? 5000);
  $slider_dots_enabled = isset($attributes['sliderDots']) ? (bool) $attributes['sliderDots'] : true;
  $slider_arrows_enabled = isset($attributes['sliderArrows']) ? (bool) $attributes['sliderArrows'] : true;

  $inline_style = sprintf(
    'background:%s;padding:%dpx 0;--trava-testimonials-text:%s;',
    esc_attr($background_color),
    $vertical_padding,
    esc_attr($attributes['textColor'] ?? 'inherit')
  );

  ob_start(); ?>
  <section
    id="testimonials"
    class="trava-testimonials trava-animate"
    style="<?php echo $inline_style; ?>"
    <?php echo trava_text_anim_attr($attributes); ?>
    data-loop="<?php echo $slider_loop_enabled ? 'true' : 'false'; ?>"
    data-speed="<?php echo esc_attr($slider_speed); ?>"
    data-space="<?php echo esc_attr($slider_space); ?>"
    data-autoplay="<?php echo $slider_autoplay_enabled ? 'true' : 'false'; ?>"
    data-delay="<?php echo esc_attr($slider_delay); ?>"
    data-dots="<?php echo $slider_dots_enabled ? 'true' : 'false'; ?>"
    data-arrows="<?php echo $slider_arrows_enabled ? 'true' : 'false'; ?>"
  >
    <div class="trava-container">
      <p class="trava-section__kicker"><?php echo esc_html($attributes['kicker'] ?? 'Testimonials'); ?></p>
      <h2 class="trava-section__title"><?php echo esc_html($attributes['title'] ?? ''); ?></h2>
      <div class="trava-section__underline"></div>

      <div class="swiper trava-testimonials__swiper" style="margin-top:40px;">
        <div class="swiper-wrapper">
          <?php $index = 0; foreach ($items as $item): $index++; $fallback_image = 'testimonial-' . min($index, 3) . '.png';
            $image_url = !empty($item['image']) ? esc_url($item['image']) : trava_img($fallback_image);
          ?>
          <div class="swiper-slide">
            <div class="trava-testimonial-card">
              <div class="trava-testimonial-card__left">
                <div class="trava-testimonial-card__meta">
                  <?php if (!empty($item['brand'])): ?>
                    <div class="trava-testimonial-card__brand"><?php echo esc_html($item['brand']); ?></div>
                  <?php endif; ?>
                  <strong><?php echo esc_html($item['name'] ?? ''); ?></strong>
                  <span><?php echo esc_html($item['company'] ?? ''); ?></span>
                </div>
                <p class="trava-testimonial-card__text"><?php echo esc_html($item['text'] ?? ''); ?></p>
              </div>
              <div class="trava-testimonial-card__right"><img src="<?php echo esc_url($image_url); ?>" alt=""></div>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>

      <?php if ($slider_dots_enabled || $slider_arrows_enabled): ?>
        <div class="trava-testimonials__nav">
          <?php if ($slider_dots_enabled): ?>
            <div class="swiper-pagination"></div>
          <?php endif; ?>
          <?php if ($slider_arrows_enabled): ?>
            <div class="trava-testimonials__buttons">
              <button class="trava-swiper-prev" type="button" aria-label="Previous testimonial"><span class="icon-ablocks-arrow-left"></span></button>
              <button class="trava-swiper-next" type="button" aria-label="Next testimonial"><span class="icon-ablocks-arrow-right"></span></button>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>
    </div>
  </section>
  <?php return ob_get_clean();
}

function trava_render_cta($attributes) {
  $background_image_url = !empty($attributes['bgImage']) ? esc_url($attributes['bgImage']) : trava_img('cta-bg.png');
  $padding_bottom = intval($attributes['padB'] ?? 80);

  $button_icon_type = $attributes['btnIconType'] ?? 'icomoon';
  $button_icon_class = $attributes['btnIconClass'] ?? 'icon-ablocks-arrow-right';
  $button_icon_image = $attributes['btnIconImage'] ?? '';

  $inline_style = sprintf(
    'padding-bottom:%dpx;--trava-cta-text:%s;--trava-cta-btn-bg:%s;--trava-cta-btn-text:%s;--trava-cta-btn-icon-bg:%s;--trava-cta-btn-icon-color:%s;',
    $padding_bottom,
    esc_attr($attributes['textColor'] ?? '#ffffff'),
    esc_attr($attributes['btnBg'] ?? 'rgba(255,255,255,.6)'),
    esc_attr($attributes['btnTextColor'] ?? '#101828'),
    esc_attr($attributes['btnIconBg'] ?? 'var(--trava-button)'),
    esc_attr($attributes['btnIconColor'] ?? '#020618')
  );

  ob_start(); ?>
  <section id="cta" class="trava-cta trava-animate" style="<?php echo $inline_style; ?>"<?php echo trava_text_anim_attr($attributes); ?>>
    <div class="trava-container">
      <div class="trava-cta__wrap">
        <img src="<?php echo esc_url($background_image_url); ?>" alt="">
        <div class="trava-cta__glass">
          <h2><?php echo esc_html($attributes['heading'] ?? ''); ?></h2>
          <p><?php echo esc_html($attributes['text'] ?? ''); ?></p>
          <a class="trava-btn trava-btn--light" href="<?php echo esc_url($attributes['ctaUrl'] ?? '#'); ?>">
            <?php echo esc_html($attributes['ctaText'] ?? ''); ?>
            <span class="trava-btn__icon"><?php echo trava_render_icon($button_icon_type, $button_icon_class, $button_icon_image, ''); ?></span>
          </a>
        </div>
      </div>
    </div>
  </section>
  <?php return ob_get_clean();
}

function trava_render_footer($attributes) {
  $vertical_padding = intval($attributes['padY'] ?? 48);
  $navigation_links = is_array($attributes['navLinks'] ?? null) ? $attributes['navLinks'] : [];
  $services_links = is_array($attributes['servicesLinks'] ?? null) ? $attributes['servicesLinks'] : [];

  $inline_style = sprintf(
    'padding:%dpx 0;--trava-footer-bg:%s;--trava-footer-text:%s;--trava-footer-heading:%s;--trava-footer-link:%s;--trava-footer-link-hover:%s;--trava-footer-social-bg:%s;--trava-footer-social-color:%s;--trava-footer-social-hover-bg:%s;--trava-footer-social-hover-color:%s;--trava-footer-border:%s;--trava-footer-top-gap:%dpx;--trava-footer-top-gap-desktop:%dpx;--trava-footer-cols-gap:%dpx;--trava-footer-bottom-gap:%dpx;--trava-footer-link-gap:%dpx;',
    $vertical_padding,
    esc_attr($attributes['bgColor'] ?? '#0F160C'),
    esc_attr($attributes['textColor'] ?? '#DAE2EC'),
    esc_attr($attributes['headingColor'] ?? '#ffffff'),
    esc_attr($attributes['linkColor'] ?? '#DAE2EC'),
    esc_attr($attributes['linkHoverColor'] ?? '#C9F054'),
    esc_attr($attributes['socialBg'] ?? '#C9F054'),
    esc_attr($attributes['socialColor'] ?? '#020618'),
    esc_attr($attributes['socialHoverBg'] ?? '#E7FF80'),
    esc_attr($attributes['socialHoverColor'] ?? '#0F160C'),
    esc_attr($attributes['borderColor'] ?? 'rgba(218,226,236,.2)'),
    intval($attributes['topGap'] ?? 32),
    intval($attributes['topGapDesktop'] ?? 80),
    intval($attributes['colsGap'] ?? 24),
    intval($attributes['bottomGap'] ?? 24),
    intval($attributes['linkGap'] ?? 6)
  );

  ob_start(); ?>
  <footer id="contact" class="trava-footer" style="<?php echo $inline_style; ?>"<?php echo trava_text_anim_attr($attributes); ?>>
    <div class="trava-container">
      <div class="trava-footer__top">
        <div class="trava-footer__brand">
          <h3><?php echo esc_html($attributes['brandText'] ?? 'TravAccount'); ?></h3>
          <p><?php echo esc_html($attributes['aboutText'] ?? ''); ?></p>
          <div class="trava-social">
            <a href="<?php echo esc_url($attributes['twitterUrl'] ?? '#'); ?>" aria-label="Twitter"><span class="icon-ablocks-twitter"></span></a>
            <a href="<?php echo esc_url($attributes['instagramUrl'] ?? '#'); ?>" aria-label="Instagram"><span class="icon-ablocks-instagram"></span></a>
            <a href="<?php echo esc_url($attributes['youtubeUrl'] ?? '#'); ?>" aria-label="YouTube"><span class="icon-ablocks-youtube"></span></a>
          </div>
        </div>
        <div class="trava-footer__cols">
          <div>
            <h4><?php echo esc_html($attributes['navTitle'] ?? 'Navigation'); ?></h4>
            <?php foreach ($navigation_links as $nav_link):
              $link_label = $nav_link['label'] ?? '';
              $link_url = $nav_link['url'] ?? '#';
              if ($link_label === '') {
                continue;
              }
            ?>
              <a href="<?php echo esc_url($link_url); ?>"><?php echo esc_html($link_label); ?></a>
            <?php endforeach; ?>
          </div>
          <div>
            <h4><?php echo esc_html($attributes['servicesTitle'] ?? 'Services'); ?></h4>
            <?php foreach ($services_links as $services_link):
              $link_label = $services_link['label'] ?? '';
              $link_url = $services_link['url'] ?? '#';
              if ($link_label === '') {
                continue;
              }
            ?>
              <a href="<?php echo esc_url($link_url); ?>"><?php echo esc_html($link_label); ?></a>
            <?php endforeach; ?>
          </div>
          <div>
            <h4><?php echo esc_html($attributes['contactTitle'] ?? 'Contact Us'); ?></h4>
            <p><?php echo esc_html($attributes['supportText'] ?? ''); ?></p>
            <p><span class="icon-ablocks-map-pin"></span> <?php echo esc_html($attributes['address'] ?? ''); ?></p>
            <p><span class="icon-ablocks-phone"></span> <?php echo esc_html($attributes['phone'] ?? ''); ?></p>
          </div>
        </div>
      </div>
      <div class="trava-footer__bottom">
        <div><?php echo esc_html($attributes['bottomLeft'] ?? ''); ?></div>
        <div><?php echo esc_html($attributes['bottomRight'] ?? ''); ?></div>
      </div>
    </div>
  </footer>
  <?php return ob_get_clean();
}
