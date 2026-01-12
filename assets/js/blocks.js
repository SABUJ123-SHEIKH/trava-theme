(function (wp) {
  if (!wp || !wp.blocks) {
    return;
  }

  var createElement = wp.element.createElement;
  var Fragment = wp.element.Fragment;
  var useBlockProps = wp.blockEditor.useBlockProps;
  var InspectorControls = wp.blockEditor.InspectorControls;
  var PanelBody = wp.components.PanelBody;
  var TextControl = wp.components.TextControl;
  var TextareaControl = wp.components.TextareaControl;
  var RangeControl = wp.components.RangeControl;
  var ColorPalette = wp.components.ColorPalette;
  var Button = wp.components.Button;
  var MediaUpload = wp.blockEditor.MediaUpload;
  var SelectControl = wp.components.SelectControl;
  var ToggleControl = wp.components.ToggleControl;

  var TEXT_ANIM_OPTIONS = [
    { label: 'None', value: 'none' },
    { label: 'Rise', value: 'text-rise' },
    { label: 'Fade', value: 'text-fade' },
    { label: 'Stagger', value: 'text-stagger' },
    { label: 'Letters Fade In', value: 'text-letters-fade' },
    { label: 'Letters Fade In Randomly', value: 'text-letters-random' }
  ];
  var TEXT_ANIM_TRIGGER_OPTIONS = [
    { label: 'Scroll', value: 'scroll' },
    { label: 'Load', value: 'load' }
  ];

  function getThemeImage(key) {
    if (window.travaThemeData && window.travaThemeData.images) {
      return window.travaThemeData.images[key] || '';
    }
    return '';
  }

  function getList(value) {
    return Array.isArray(value) ? value : [];
  }

  function updateItem(items, index, patch) {
    return items.map(function (item, itemIndex) {
      return itemIndex === index ? Object.assign({}, item, patch) : item;
    });
  }

  function getAnimateProps(attributes) {
    if (!attributes || !attributes.textAnim || attributes.textAnim === 'none') {
      return {};
    }
    return {
      'data-animate': attributes.textAnim,
      'data-animate-trigger': attributes.textAnimTrigger || 'scroll'
    };
  }

  function buildBlockProps(className, style, attributes) {
    return useBlockProps(Object.assign({
      className: className,
      style: style
    }, getAnimateProps(attributes)));
  }

  function setAttr(setAttributes, key) {
    return function (value) {
      var next = {};
      next[key] = value;
      setAttributes(next);
    };
  }

  function addItem(items, item) {
    return items.concat([item]);
  }

  function removeItem(items, index) {
    return items.filter(function (currentItem, itemIndex) {
      return itemIndex !== index;
    });
  }

  function renderAnimationPanel(attributes, setAttributes) {
    return createElement(PanelBody, { title: 'Animation', initialOpen: false },
      createElement(SelectControl, { label: 'Text Animation', value: attributes.textAnim || 'none', options: TEXT_ANIM_OPTIONS, onChange: setAttr(setAttributes, 'textAnim') }),
      createElement(SelectControl, { label: 'Trigger', value: attributes.textAnimTrigger || 'scroll', options: TEXT_ANIM_TRIGGER_OPTIONS, onChange: setAttr(setAttributes, 'textAnimTrigger') })
    );
  }

  var ICONS = [
    { label: 'Briefcase', value: 'icon-ablocks-briefcase' },
    { label: 'Wallet', value: 'icon-ablocks-wallet' },
    { label: 'Calculator', value: 'icon-ablocks-calculator' },
    { label: 'Shield', value: 'icon-ablocks-shield' },
    { label: 'Star', value: 'icon-ablocks-star' },
    { label: 'Arrow Right', value: 'icon-ablocks-arrow-right' },
    { label: 'Arrow Left', value: 'icon-ablocks-arrow-left' },
    { label: 'Plus', value: 'icon-ablocks-plus' },
    { label: 'Twitter', value: 'icon-ablocks-twitter' },
    { label: 'Instagram', value: 'icon-ablocks-instagram' },
    { label: 'YouTube', value: 'icon-ablocks-youtube' },
    { label: 'Map Pin', value: 'icon-ablocks-map-pin' },
    { label: 'Phone', value: 'icon-ablocks-phone' }
  ];

  function IconPicker(iconPickerProps) {
    var type = iconPickerProps.type || 'icomoon';
    return createElement('div', {},
      createElement(SelectControl, {
        label: iconPickerProps.label || 'Icon Type',
        value: type,
        options: [
          { label: 'IcoMoon', value: 'icomoon' },
          { label: 'Upload Image', value: 'image' }
        ],
        onChange: function (value) { iconPickerProps.onChangeType(value); }
      }),
      type === 'icomoon'
        ? createElement(SelectControl, {
          label: 'IcoMoon Icon',
          value: iconPickerProps.iconClass || ICONS[0].value,
          options: ICONS,
          onChange: function (value) { iconPickerProps.onChangeClass(value); }
        })
        : createElement(MediaUpload, {
          onSelect: function (media) { iconPickerProps.onChangeImage(media.url); },
          allowedTypes: ['image'],
          render: function (renderProps) {
            return createElement(Button, { onClick: renderProps.open, variant: 'secondary' }, iconPickerProps.iconImage ? 'Change Icon Image' : 'Upload Icon Image');
          }
        })
    );
  }

  function renderIcon(type, iconClass, iconImage) {
    if (type === 'image' && iconImage) {
      return createElement('img', { className: 'trava-icon-img', src: iconImage, alt: '' });
    }
    return createElement('span', { className: iconClass });
  }

  function highlightHeading(text, highlightText) {
    var rawText = text || '';
    var highlightNeedle = (highlightText || '').trim();
    var escapedHighlight = highlightNeedle ? highlightNeedle.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') : '';

    if (escapedHighlight) {
      var highlightRegex = new RegExp('(' + escapedHighlight + ')', 'ig');
      var parts = rawText.split(highlightRegex);
      if (parts.length > 1) {
        return parts.map(function (part, partIndex) {
          if (highlightNeedle && part.toLowerCase() === highlightNeedle.toLowerCase()) {
            return createElement('span', { className: 'trava-hero__title-highlight', key: 'hl-' + partIndex }, part);
          }
          return part;
        });
      }
    }

    var fallbackWords = rawText.trim().split(/\\s+/);
    if (fallbackWords.length >= 2) {
      var fallbackWord = fallbackWords[1];
      var fallbackRegex = new RegExp('(\\b' + fallbackWord.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\\\$&') + '\\\\b)');
      var outputParts = [];
      var chunks = rawText.split(fallbackRegex);
      var highlightApplied = false;

      chunks.forEach(function (part, chunkIndex) {
        if (!highlightApplied && part === fallbackWord) {
          outputParts.push(createElement('span', { className: 'trava-hero__title-highlight', key: 'hl-fb-' + chunkIndex }, part));
          highlightApplied = true;
        } else {
          outputParts.push(part);
        }
      });
      return outputParts;
    }

    return rawText;
  }

  // HERO
  wp.blocks.registerBlockType('trava/hero', {
    title: 'Trava Hero',
    icon: 'cover-image',
    category: 'trava-blocks',
    attributes: {
      heading: { type: 'string', default: 'Accounting Redefined For Growth' },
      subheading: { type: 'string', default: 'TravAccount helps startups, freelancers, and small businesses stay compliant, make smarter financial decisions, and save valuable time.' },
      ctaText: { type: 'string', default: 'Book a Free Consultation' },
      ctaUrl: { type: 'string', default: '#' },
      imageUrl: { type: 'string', default: '' },
      bgColor: { type: 'string', default: '#0F160C' },
      padY: { type: 'number', default: 72 },
      textColor: { type: 'string', default: '#F1F5F9' },
      subtitleColor: { type: 'string', default: '#ffffff' },
      highlightText: { type: 'string', default: 'Redefined' },
      highlightColor: { type: 'string', default: '#C9F054' },
      btnBg: { type: 'string', default: 'rgba(255,255,255,.25)' },
      btnTextColor: { type: 'string', default: '#F8FAFC' },
      btnIconBg: { type: 'string', default: '#BBF451' },
      btnIconColor: { type: 'string', default: '#020618' },
      btnIconType: { type: 'string', default: 'icomoon' },
      btnIconClass: { type: 'string', default: 'icon-ablocks-arrow-right' },
      btnIconImage: { type: 'string', default: '' },
      textAnim: { type: 'string', default: 'none' },
      textAnimTrigger: { type: 'string', default: 'scroll' }
    },
    edit: function (editorProps) {
      var attributes = editorProps.attributes;
      var setAttributes = editorProps.setAttributes;
      var style = {
        background: attributes.bgColor,
        padding: (attributes.padY || 72) + 'px 0',
        '--trava-hero-text': attributes.textColor,
        '--trava-hero-subtitle': attributes.subtitleColor,
        '--trava-hero-highlight': attributes.highlightColor,
        '--trava-hero-btn-bg': attributes.btnBg,
        '--trava-hero-btn-text': attributes.btnTextColor,
        '--trava-hero-btn-icon-bg': attributes.btnIconBg,
        '--trava-hero-btn-icon-color': attributes.btnIconColor
      };
      var blockProps = buildBlockProps('trava-hero', style, attributes);
      var heroImageUrl = attributes.imageUrl || getThemeImage('hero');

      return createElement(Fragment, {},
        createElement(InspectorControls, {},
          createElement(PanelBody, { title: 'Content', initialOpen: true },
            createElement(TextControl, { label: 'Heading', value: attributes.heading, onChange: setAttr(setAttributes, 'heading') }),
            createElement('p', {}, 'Highlight Color'),
            createElement(ColorPalette, { value: attributes.highlightColor, onChange: setAttr(setAttributes, 'highlightColor') }),
            createElement(TextareaControl, { label: 'Subheading', value: attributes.subheading, onChange: setAttr(setAttributes, 'subheading') }),
            createElement(TextControl, { label: 'CTA Text', value: attributes.ctaText, onChange: setAttr(setAttributes, 'ctaText') }),
            createElement(TextControl, { label: 'CTA URL', value: attributes.ctaUrl, onChange: setAttr(setAttributes, 'ctaUrl') }),
            createElement(MediaUpload, {
              onSelect: function (media) { setAttributes({ imageUrl: media.url }); },
              allowedTypes: ['image'],
              render: function (renderProps) {
                return createElement(Button, { onClick: renderProps.open, variant: 'secondary' }, attributes.imageUrl ? 'Change Hero Image' : 'Select Hero Image');
              }
            })
          ),
          createElement(PanelBody, { title: 'Style', initialOpen: false },
            createElement('p', {}, 'Background'),
            createElement(ColorPalette, { value: attributes.bgColor, onChange: setAttr(setAttributes, 'bgColor') }),
            createElement(RangeControl, { label: 'Vertical padding (px)', min: 24, max: 120, value: attributes.padY, onChange: setAttr(setAttributes, 'padY') }),
            createElement('p', {}, 'Title/Text Color'),
            createElement(ColorPalette, { value: attributes.textColor, onChange: setAttr(setAttributes, 'textColor') }),
            createElement('p', {}, 'Subtitle Color'),
            createElement(ColorPalette, { value: attributes.subtitleColor, onChange: setAttr(setAttributes, 'subtitleColor') })
          ),
          createElement(PanelBody, { title: 'Button Styles', initialOpen: false },
            createElement('p', {}, 'Button Background'),
            createElement(ColorPalette, { value: attributes.btnBg, onChange: setAttr(setAttributes, 'btnBg') }),
            createElement('p', {}, 'Button Text Color'),
            createElement(ColorPalette, { value: attributes.btnTextColor, onChange: setAttr(setAttributes, 'btnTextColor') }),
            createElement('p', {}, 'Icon Background'),
            createElement(ColorPalette, { value: attributes.btnIconBg, onChange: setAttr(setAttributes, 'btnIconBg') }),
            createElement('p', {}, 'Icon Color'),
            createElement(ColorPalette, { value: attributes.btnIconColor, onChange: setAttr(setAttributes, 'btnIconColor') }),
            createElement(IconPicker, {
              label: 'CTA Icon Type',
              type: attributes.btnIconType,
              iconClass: attributes.btnIconClass,
              iconImage: attributes.btnIconImage,
              onChangeType: function (value) { setAttributes({ btnIconType: value }); },
              onChangeClass: function (value) { setAttributes({ btnIconClass: value }); },
              onChangeImage: function (value) { setAttributes({ btnIconImage: value }); }
            })
          ),
          renderAnimationPanel(attributes, setAttributes)
        ),
        createElement('section', blockProps,
          createElement('div', { className: 'trava-container' },
            createElement('div', { className: 'trava-hero__grid' },
              createElement('div', {},
                createElement('h1', { className: 'trava-hero__title' }, highlightHeading(attributes.heading || '', attributes.highlightText || '')),
                createElement('p', { className: 'trava-hero__subtitle' }, attributes.subheading),
                createElement('a', { className: 'trava-btn', href: '#' },
                  attributes.ctaText,
                  createElement('span', { className: 'trava-btn__icon' }, renderIcon(attributes.btnIconType, attributes.btnIconClass, attributes.btnIconImage))
                )
              ),
              createElement('div', { className: 'trava-hero__media' },
                heroImageUrl ? createElement('img', { src: heroImageUrl, alt: '' }) : null
              )
            )
          )
        )
      );
    },
    save: function () { return null; }
  });

  // HEADER
  wp.blocks.registerBlockType('trava/header', {
    title: 'Trava Header',
    icon: 'menu',
    category: 'trava-blocks',
    attributes: {
      logoUrl: { type: 'string', default: '' },
      logoLink: { type: 'string', default: '#' },
      navItems: { type: 'array', default: [
        { label: 'Home', url: '#home' },
        { label: 'Services', url: '#services' },
        { label: 'Testimonials', url: '#testimonials' },
        { label: 'CTA', url: '#cta' },
        { label: 'Contact', url: '#contact' }
      ] },
      navCtaText: { type: 'string', default: "Let's Talk" },
      navCtaUrl: { type: 'string', default: '#' },
      navCtaShow: { type: 'boolean', default: true },
      navCtaHideMobile: { type: 'boolean', default: false },
      navCtaIconType: { type: 'string', default: 'icomoon' },
      navCtaIconClass: { type: 'string', default: 'icon-ablocks-plus' },
      navCtaIconImage: { type: 'string', default: '' },
      bgColor: { type: 'string', default: '#0F160C' },
      padY: { type: 'number', default: 24 },
      textColor: { type: 'string', default: '#F1F5F9' },
      textAnim: { type: 'string', default: 'none' },
      textAnimTrigger: { type: 'string', default: 'scroll' }
    },
    edit: function (editorProps) {
      var attributes = editorProps.attributes;
      var setAttributes = editorProps.setAttributes;
      var navItems = getList(attributes.navItems);
      var style = {
        background: attributes.bgColor,
        padding: (attributes.padY || 24) + 'px 0',
        '--trava-header-text': attributes.textColor
      };
      var blockProps = buildBlockProps('trava-header', style, attributes);
      var logoImageUrl = attributes.logoUrl || getThemeImage('logo');

      return createElement(Fragment, {},
        createElement(InspectorControls, {},
          createElement(PanelBody, { title: 'Header', initialOpen: true },
            createElement(MediaUpload, {
              onSelect: function (media) { setAttributes({ logoUrl: media.url }); },
              allowedTypes: ['image'],
              render: function (renderProps) {
                return createElement(Button, { onClick: renderProps.open, variant: 'secondary' }, attributes.logoUrl ? 'Change Logo' : 'Select Logo');
              }
            }),
            createElement(TextControl, { label: 'Logo Link URL', value: attributes.logoLink, onChange: setAttr(setAttributes, 'logoLink') })
          ),
          createElement(PanelBody, { title: 'Header Menu', initialOpen: false },
            navItems.map(function (item, index) {
              return createElement('div', { key: index, style: { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' } },
                createElement(TextControl, { label: 'Label', value: item.label || '', onChange: function (value) { setAttributes({ navItems: updateItem(navItems, index, { label: value }) }); } }),
                createElement(TextControl, { label: 'URL', value: item.url || '', onChange: function (value) { setAttributes({ navItems: updateItem(navItems, index, { url: value }) }); } }),
                createElement(Button, { isDestructive: true, onClick: function () { setAttributes({ navItems: removeItem(navItems, index) }); } }, 'Remove')
              );
            }),
            createElement(Button, { variant: 'secondary', onClick: function () { setAttributes({ navItems: addItem(navItems, { label: 'New Item', url: '#' }) }); } }, 'Add Menu Item'),
            createElement('div', { style: { marginTop: '16px' } }),
            createElement(ToggleControl, { label: 'Show Header Button', checked: !!attributes.navCtaShow, onChange: setAttr(setAttributes, 'navCtaShow') }),
            createElement(ToggleControl, { label: 'Hide Header Button on Mobile', checked: !!attributes.navCtaHideMobile, onChange: setAttr(setAttributes, 'navCtaHideMobile') }),
            attributes.navCtaShow ? createElement(TextControl, { label: 'Header Button Text', value: attributes.navCtaText, onChange: setAttr(setAttributes, 'navCtaText') }) : null,
            attributes.navCtaShow ? createElement(TextControl, { label: 'Header Button URL', value: attributes.navCtaUrl, onChange: setAttr(setAttributes, 'navCtaUrl') }) : null,
            attributes.navCtaShow ? createElement(IconPicker, {
              label: 'Header Button Icon',
              type: attributes.navCtaIconType,
              iconClass: attributes.navCtaIconClass,
              iconImage: attributes.navCtaIconImage,
              onChangeType: function (value) { setAttributes({ navCtaIconType: value }); },
              onChangeClass: function (value) { setAttributes({ navCtaIconClass: value }); },
              onChangeImage: function (value) { setAttributes({ navCtaIconImage: value }); }
            }) : null
          ),
          createElement(PanelBody, { title: 'Style', initialOpen: false },
            createElement('p', {}, 'Background'),
            createElement(ColorPalette, { value: attributes.bgColor, onChange: setAttr(setAttributes, 'bgColor') }),
            createElement('p', {}, 'Text Color'),
            createElement(ColorPalette, { value: attributes.textColor, onChange: setAttr(setAttributes, 'textColor') }),
            createElement(RangeControl, { label: 'Vertical padding (px)', min: 8, max: 80, value: attributes.padY, onChange: setAttr(setAttributes, 'padY') })
          ),
          renderAnimationPanel(attributes, setAttributes)
        ),
        createElement('header', blockProps,
          createElement('div', { className: 'trava-container' },
            createElement('div', { className: 'trava-header__nav' },
              createElement('div', { className: 'trava-brand' },
                createElement('a', { href: attributes.logoLink || '#', 'aria-label': 'Home' },
                  createElement('img', { src: logoImageUrl, alt: '' })
                )
              ),
              createElement('button', { className: 'trava-mobile-toggle', type: 'button', 'aria-label': 'Toggle menu', 'aria-expanded': false },
                createElement('span', { className: 'icon-ablocks-menu' })
              ),
              navItems.length ? createElement('nav', { className: 'trava-navpill' },
                createElement('button', { className: 'trava-navpill__close', type: 'button', 'aria-label': 'Close menu' },
                  createElement('span', { className: 'icon-ablocks-plus' })
                ),
                createElement('ul', { className: 'trava-navpill__list' },
                  navItems.map(function (item, index) {
                    return createElement('li', { key: index }, createElement('a', { href: item.url || '#' }, item.label || ''));
                  })
                )
              ) : null,
              attributes.navCtaShow ? createElement('a', { className: 'trava-btn trava-btn--nav' + (attributes.navCtaHideMobile ? ' trava-btn--nav-hide-mobile' : ''), href: attributes.navCtaUrl || '#' },
                createElement('span', {}, attributes.navCtaText || ''),
                createElement('span', { className: 'trava-btn__icon' }, renderIcon(attributes.navCtaIconType, attributes.navCtaIconClass, attributes.navCtaIconImage))
              ) : null
            )
          )
        )
      );
    },
    save: function () { return null; }
  });

  // SERVICES
  wp.blocks.registerBlockType('trava/services', {
    title: 'Trava Services',
    icon: 'grid-view',
    category: 'trava-blocks',
    attributes: {
      items: { type: 'array', default: [
        { iconType: 'icomoon', iconClass: 'icon-ablocks-briefcase', iconImage: '', title: 'Bookkeeping', text: 'Accurate and timely bookkeeping services to keep your financial records organized and up-to-date.' },
        { iconType: 'icomoon', iconClass: 'icon-ablocks-wallet', iconImage: '', title: 'Payroll Management', text: 'Efficient payroll processing to ensure your employees are paid accurately and on time.' },
        { iconType: 'icomoon', iconClass: 'icon-ablocks-calculator', iconImage: '', title: 'Tax Planning', text: 'Strategic tax planning to minimize your tax liabilities and maximize your savings.' },
        { iconType: 'icomoon', iconClass: 'icon-ablocks-shield', iconImage: '', title: 'Audit Services', text: 'Thorough audit services to ensure compliance and identify areas for improvement.' }
      ] },
      sideTitle: { type: 'string', default: 'Start your growth Journey' },
      sideCtaText: { type: 'string', default: 'Get in Touch' },
      sideCtaUrl: { type: 'string', default: '#' },
      sideImage: { type: 'string', default: '' },
      bgColor: { type: 'string', default: '#FEFFFA' },
      padY: { type: 'number', default: 80 },
      textColor: { type: 'string', default: 'inherit' },
      cardBg: { type: 'string', default: '#ffffff' },
      cardBorder: { type: 'string', default: '#D1D5DC' },
      cardTitleColor: { type: 'string', default: '#222222' },
      cardTextColor: { type: 'string', default: '#474747' },
      cardIconBg: { type: 'string', default: '#c3f53c' },
      cardIconColor: { type: 'string', default: '#0F160C' },
      textAnim: { type: 'string', default: 'none' },
      textAnimTrigger: { type: 'string', default: 'scroll' }
    },
    edit: function (editorProps) {
      var attributes = editorProps.attributes;
      var setAttributes = editorProps.setAttributes;
      var items = getList(attributes.items);
      var style = {
        background: attributes.bgColor,
        padding: (attributes.padY || 80) + 'px 0',
        '--trava-services-text': attributes.textColor,
        '--trava-card-bg': attributes.cardBg,
        '--trava-card-border': attributes.cardBorder,
        '--trava-card-title': attributes.cardTitleColor,
        '--trava-card-text': attributes.cardTextColor,
        '--trava-card-icon-bg': attributes.cardIconBg,
        '--trava-card-icon-color': attributes.cardIconColor
      };
      var blockProps = buildBlockProps('trava-services', style, attributes);
      var sideImageUrl = attributes.sideImage || getThemeImage('serviceSide');

      return createElement(Fragment, {},
        createElement(InspectorControls, {},
          createElement(PanelBody, { title: 'Section Style', initialOpen: false },
            createElement('p', {}, 'Background'),
            createElement(ColorPalette, { value: attributes.bgColor, onChange: setAttr(setAttributes, 'bgColor') }),
            createElement(RangeControl, { label: 'Vertical padding (px)', min: 24, max: 140, value: attributes.padY, onChange: setAttr(setAttributes, 'padY') }),
            createElement('p', {}, 'Text Color'),
            createElement(ColorPalette, { value: attributes.textColor, onChange: setAttr(setAttributes, 'textColor') })
          ),
          createElement(PanelBody, { title: 'Card Style', initialOpen: false },
            createElement('p', {}, 'Card Background'),
            createElement(ColorPalette, { value: attributes.cardBg, onChange: setAttr(setAttributes, 'cardBg') }),
            createElement('p', {}, 'Card Border'),
            createElement(ColorPalette, { value: attributes.cardBorder, onChange: setAttr(setAttributes, 'cardBorder') }),
            createElement('p', {}, 'Title Color'),
            createElement(ColorPalette, { value: attributes.cardTitleColor, onChange: setAttr(setAttributes, 'cardTitleColor') }),
            createElement('p', {}, 'Text Color'),
            createElement(ColorPalette, { value: attributes.cardTextColor, onChange: setAttr(setAttributes, 'cardTextColor') }),
            createElement('p', {}, 'Icon Background'),
            createElement(ColorPalette, { value: attributes.cardIconBg, onChange: setAttr(setAttributes, 'cardIconBg') }),
            createElement('p', {}, 'Icon Color'),
            createElement(ColorPalette, { value: attributes.cardIconColor, onChange: setAttr(setAttributes, 'cardIconColor') })
          ),
          createElement(PanelBody, { title: 'Side Card', initialOpen: false },
            createElement(TextControl, { label: 'Side Title', value: attributes.sideTitle, onChange: setAttr(setAttributes, 'sideTitle') }),
            createElement(TextControl, { label: 'Side CTA Text', value: attributes.sideCtaText, onChange: setAttr(setAttributes, 'sideCtaText') }),
            createElement(TextControl, { label: 'Side CTA URL', value: attributes.sideCtaUrl, onChange: setAttr(setAttributes, 'sideCtaUrl') }),
            createElement(MediaUpload, {
              onSelect: function (media) { setAttributes({ sideImage: media.url }); },
              allowedTypes: ['image'],
              render: function (renderProps) {
                return createElement(Button, { onClick: renderProps.open, variant: 'secondary' }, attributes.sideImage ? 'Change Side Image' : 'Select Side Image');
              }
            })
          ),
          renderAnimationPanel(attributes, setAttributes)
        ),
        createElement('section', blockProps,
          createElement('div', { className: 'trava-container' },
            createElement('div', { className: 'trava-services__grid' },
              createElement('div', { className: 'trava-services__cards' },
                items.map(function (item, index) {
                  return createElement('article', { className: 'trava-card', key: index },
                    createElement('div', { className: 'trava-card__icon' }, renderIcon(item.iconType || 'icomoon', item.iconClass || ICONS[0].value, item.iconImage || '')),
                    createElement('h3', { className: 'trava-card__title' }, item.title || ''),
                    createElement('p', { className: 'trava-card__text' }, item.text || ''),
                    createElement('div', { style: { marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' } },
                      createElement(IconPicker, {
                        label: 'Card Icon',
                        type: item.iconType || 'icomoon',
                        iconClass: item.iconClass || ICONS[0].value,
                        iconImage: item.iconImage || '',
                        onChangeType: function (value) { setAttributes({ items: updateItem(items, index, { iconType: value }) }); },
                        onChangeClass: function (value) { setAttributes({ items: updateItem(items, index, { iconClass: value }) }); },
                        onChangeImage: function (value) { setAttributes({ items: updateItem(items, index, { iconImage: value }) }); }
                      }),
                      createElement(Button, { isDestructive: true, onClick: function () { setAttributes({ items: removeItem(items, index) }); } }, 'Remove')
                    )
                  );
                }),
                createElement(Button, { variant: 'primary', onClick: function () {
                  setAttributes({ items: addItem(items, { iconType: 'icomoon', iconClass: ICONS[0].value, iconImage: '', title: 'New Service', text: 'Write details...' }) });
                } }, 'Add Service')
              ),
              createElement('aside', { className: 'trava-services__side' },
                sideImageUrl ? createElement('img', { src: sideImageUrl, alt: '' }) : null,
                createElement('div', { className: 'trava-side__cta' },
                  createElement('h3', {}, attributes.sideTitle),
                  createElement('a', { className: 'trava-btn trava-btn--light', href: '#' },
                    attributes.sideCtaText,
                    createElement('span', { className: 'trava-btn__icon' }, createElement('span', { className: 'icon-ablocks-arrow-right' }))
                  )
                )
              )
            )
          )
        )
      );
    },
    save: function () { return null; }
  });

  // TESTIMONIALS
  wp.blocks.registerBlockType('trava/testimonials', {
    title: 'Trava Testimonials',
    icon: 'format-quote',
    category: 'trava-blocks',
    attributes: {
      kicker: { type: 'string', default: 'Testimonials' },
      title: { type: 'string', default: 'Hear people say and reveal our finest services' },
      items: { type: 'array', default: [
        { brand: 'stripe', name: 'Oliver Davies', company: 'Travacount PLC', text: 'TravAccounting has been instrumental in helping our business navigate complex tax regulations.', image: '' },
        { brand: '', name: 'Oliver Davies', company: 'Hexatech', text: 'Their expertise and attention to detail have saved us both time and money.', image: '' }
      ] },
      bgColor: { type: 'string', default: '#F4F4F5' },
      padY: { type: 'number', default: 72 },
      textColor: { type: 'string', default: 'inherit' },
      sliderLoop: { type: 'boolean', default: true },
      sliderSpeed: { type: 'number', default: 600 },
      sliderSpace: { type: 'number', default: 24 },
      sliderAutoplay: { type: 'boolean', default: false },
      sliderDelay: { type: 'number', default: 5000 },
      sliderDots: { type: 'boolean', default: true },
      sliderArrows: { type: 'boolean', default: true },
      textAnim: { type: 'string', default: 'none' },
      textAnimTrigger: { type: 'string', default: 'scroll' }
    },
    edit: function (editorProps) {
      var attributes = editorProps.attributes;
      var setAttributes = editorProps.setAttributes;
      var items = getList(attributes.items);
      var style = {
        background: attributes.bgColor,
        padding: (attributes.padY || 72) + 'px 0',
        '--trava-testimonials-text': attributes.textColor
      };
      var blockProps = buildBlockProps('trava-testimonials', style, attributes);
      var fallbackImageUrl = getThemeImage('test1');

      return createElement(Fragment, {},
        createElement(InspectorControls, {},
          createElement(PanelBody, { title: 'Testimonials', initialOpen: true },
            items.map(function (item, index) {
              var testimonialImageUrl = item.image || fallbackImageUrl;
              return createElement('div', { key: index, style: { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' } },
                createElement(TextControl, { label: 'Brand (optional)', value: item.brand || '', onChange: function (value) { setAttributes({ items: updateItem(items, index, { brand: value }) }); } }),
                createElement(TextControl, { label: 'Name', value: item.name || '', onChange: function (value) { setAttributes({ items: updateItem(items, index, { name: value }) }); } }),
                createElement(TextControl, { label: 'Company', value: item.company || '', onChange: function (value) { setAttributes({ items: updateItem(items, index, { company: value }) }); } }),
                createElement(TextareaControl, { label: 'Text', value: item.text || '', onChange: function (value) { setAttributes({ items: updateItem(items, index, { text: value }) }); } }),
                createElement(MediaUpload, {
                  onSelect: function (media) { setAttributes({ items: updateItem(items, index, { image: media.url }) }); },
                  allowedTypes: ['image'],
                  render: function (renderProps) {
                    return createElement(Button, { onClick: renderProps.open, variant: 'secondary' }, item.image ? 'Change Image' : 'Select Image');
                  }
                }),
                testimonialImageUrl ? createElement('img', { src: testimonialImageUrl, alt: '', style: { width: '100%', maxWidth: '280px', display: 'block', marginTop: '10px', borderRadius: '8px' } }) : null,
                createElement(Button, { isDestructive: true, onClick: function () { setAttributes({ items: removeItem(items, index) }); } }, 'Remove')
              );
            }),
            createElement(Button, { variant: 'primary', onClick: function () {
              setAttributes({ items: addItem(items, { brand: '', name: 'New Name', company: 'Company', text: 'Testimonial text...', image: '' }) });
            } }, 'Add Testimonial')
          ),
          createElement(PanelBody, { title: 'Style', initialOpen: false },
            createElement('p', {}, 'Background'),
            createElement(ColorPalette, { value: attributes.bgColor, onChange: setAttr(setAttributes, 'bgColor') }),
            createElement(RangeControl, { label: 'Vertical padding (px)', min: 24, max: 140, value: attributes.padY, onChange: setAttr(setAttributes, 'padY') }),
            createElement('p', {}, 'Text Color'),
            createElement(ColorPalette, { value: attributes.textColor, onChange: setAttr(setAttributes, 'textColor') })
          ),
          createElement(PanelBody, { title: 'Slider', initialOpen: false },
            createElement(ToggleControl, { label: 'Loop Slides', checked: !!attributes.sliderLoop, onChange: setAttr(setAttributes, 'sliderLoop') }),
            createElement(ToggleControl, { label: 'Autoplay', checked: !!attributes.sliderAutoplay, onChange: setAttr(setAttributes, 'sliderAutoplay') }),
            createElement(RangeControl, { label: 'Autoplay Delay (ms)', min: 2000, max: 10000, step: 500, value: attributes.sliderDelay, onChange: setAttr(setAttributes, 'sliderDelay') }),
            createElement(RangeControl, { label: 'Transition Speed (ms)', min: 200, max: 2000, step: 50, value: attributes.sliderSpeed, onChange: setAttr(setAttributes, 'sliderSpeed') }),
            createElement(RangeControl, { label: 'Space Between (px)', min: 0, max: 80, value: attributes.sliderSpace, onChange: setAttr(setAttributes, 'sliderSpace') }),
            createElement(ToggleControl, { label: 'Show Dots', checked: !!attributes.sliderDots, onChange: setAttr(setAttributes, 'sliderDots') }),
            createElement(ToggleControl, { label: 'Show Arrows', checked: !!attributes.sliderArrows, onChange: setAttr(setAttributes, 'sliderArrows') })
          ),
          renderAnimationPanel(attributes, setAttributes)
        ),
        createElement('section', blockProps,
          createElement('div', { className: 'trava-container' },
            createElement('p', { className: 'trava-section__kicker' }, attributes.kicker),
            createElement('h2', { className: 'trava-section__title' }, attributes.title),
            createElement('div', { className: 'trava-section__underline' }),
            createElement('div', { className: 'swiper trava-testimonials__swiper', style: { marginTop: '40px' } },
              createElement('div', { className: 'swiper-wrapper' },
                items.map(function (item, index) {
                  var testimonialImageUrl = item.image || fallbackImageUrl;
                  return createElement('div', { className: 'swiper-slide', key: index },
                    createElement('div', { className: 'trava-testimonial-card' },
                      createElement('div', { className: 'trava-testimonial-card__left' },
                        createElement('div', { className: 'trava-testimonial-card__meta' },
                          item.brand ? createElement('div', { className: 'trava-testimonial-card__brand' }, item.brand) : null,
                          createElement('strong', {}, item.name || ''),
                          createElement('span', {}, item.company || '')
                        ),
                        createElement('p', { className: 'trava-testimonial-card__text' }, item.text || '')
                      ),
                      createElement('div', { className: 'trava-testimonial-card__right' },
                        testimonialImageUrl ? createElement('img', { src: testimonialImageUrl, alt: '' }) : null
                      )
                    )
                  );
                })
              )
            ),
            (attributes.sliderDots || attributes.sliderArrows) ? createElement('div', { className: 'trava-testimonials__nav' },
              attributes.sliderDots ? createElement('div', { className: 'swiper-pagination' },
                createElement('span', { className: 'swiper-pagination-bullet swiper-pagination-bullet-active' }),
                createElement('span', { className: 'swiper-pagination-bullet' }),
                createElement('span', { className: 'swiper-pagination-bullet' })
              ) : null,
              attributes.sliderArrows ? createElement('div', { className: 'trava-testimonials__buttons' },
                createElement('button', { className: 'trava-swiper-prev', type: 'button', 'aria-label': 'Previous testimonial' },
                  createElement('span', { className: 'icon-ablocks-arrow-left' })
                ),
                createElement('button', { className: 'trava-swiper-next', type: 'button', 'aria-label': 'Next testimonial' },
                  createElement('span', { className: 'icon-ablocks-arrow-right' })
                )
              ) : null
            ) : null
          )
        )
      );
    },
    save: function () { return null; }
  });

  // CTA
  wp.blocks.registerBlockType('trava/cta', {
    title: 'Trava CTA',
    icon: 'megaphone',
    category: 'trava-blocks',
    attributes: {
      heading: { type: 'string', default: 'Ready to simplify your accounting?' },
      text: { type: 'string', default: 'Let TravAccount handle your finances while you focus on growing your business with confidence.' },
      ctaText: { type: 'string', default: 'Get Started Today' },
      ctaUrl: { type: 'string', default: '#' },
      bgImage: { type: 'string', default: '' },
      padB: { type: 'number', default: 80 },
      textColor: { type: 'string', default: '#ffffff' },
      btnBg: { type: 'string', default: 'rgba(255,255,255,.6)' },
      btnTextColor: { type: 'string', default: '#101828' },
      btnIconBg: { type: 'string', default: '#c9f054' },
      btnIconColor: { type: 'string', default: '#020618' },
      btnIconType: { type: 'string', default: 'icomoon' },
      btnIconClass: { type: 'string', default: 'icon-ablocks-arrow-right' },
      btnIconImage: { type: 'string', default: '' },
      textAnim: { type: 'string', default: 'none' },
      textAnimTrigger: { type: 'string', default: 'scroll' }
    },
    edit: function (editorProps) {
      var attributes = editorProps.attributes;
      var setAttributes = editorProps.setAttributes;
      var style = {
        paddingBottom: (attributes.padB || 80) + 'px',
        '--trava-cta-text': attributes.textColor,
        '--trava-cta-btn-bg': attributes.btnBg,
        '--trava-cta-btn-text': attributes.btnTextColor,
        '--trava-cta-btn-icon-bg': attributes.btnIconBg,
        '--trava-cta-btn-icon-color': attributes.btnIconColor
      };
      var blockProps = buildBlockProps('trava-cta', style, attributes);
      var ctaBackgroundUrl = attributes.bgImage || getThemeImage('ctaBg');

      return createElement(Fragment, {},
        createElement(InspectorControls, {},
          createElement(PanelBody, { title: 'CTA', initialOpen: true },
            createElement(TextControl, { label: 'Heading', value: attributes.heading, onChange: setAttr(setAttributes, 'heading') }),
            createElement(TextareaControl, { label: 'Text', value: attributes.text, onChange: setAttr(setAttributes, 'text') }),
            createElement(TextControl, { label: 'Button Text', value: attributes.ctaText, onChange: setAttr(setAttributes, 'ctaText') }),
            createElement(TextControl, { label: 'Button URL', value: attributes.ctaUrl, onChange: setAttr(setAttributes, 'ctaUrl') }),
            createElement(MediaUpload, {
              onSelect: function (media) { setAttributes({ bgImage: media.url }); },
              allowedTypes: ['image'],
              render: function (renderProps) {
                return createElement(Button, { onClick: renderProps.open, variant: 'secondary' }, attributes.bgImage ? 'Change Background' : 'Select Background');
              }
            }),
            createElement(RangeControl, { label: 'Bottom padding (px)', min: 0, max: 140, value: attributes.padB, onChange: setAttr(setAttributes, 'padB') })
          ),
          createElement(PanelBody, { title: 'Style', initialOpen: false },
            createElement('p', {}, 'Text Color'),
            createElement(ColorPalette, { value: attributes.textColor, onChange: setAttr(setAttributes, 'textColor') }),
            createElement('p', {}, 'Button Background'),
            createElement(ColorPalette, { value: attributes.btnBg, onChange: setAttr(setAttributes, 'btnBg') }),
            createElement('p', {}, 'Button Text Color'),
            createElement(ColorPalette, { value: attributes.btnTextColor, onChange: setAttr(setAttributes, 'btnTextColor') }),
            createElement('p', {}, 'Icon Background'),
            createElement(ColorPalette, { value: attributes.btnIconBg, onChange: setAttr(setAttributes, 'btnIconBg') }),
            createElement('p', {}, 'Icon Color'),
            createElement(ColorPalette, { value: attributes.btnIconColor, onChange: setAttr(setAttributes, 'btnIconColor') }),
            createElement(IconPicker, {
              label: 'CTA Icon Type',
              type: attributes.btnIconType,
              iconClass: attributes.btnIconClass,
              iconImage: attributes.btnIconImage,
              onChangeType: function (value) { setAttributes({ btnIconType: value }); },
              onChangeClass: function (value) { setAttributes({ btnIconClass: value }); },
              onChangeImage: function (value) { setAttributes({ btnIconImage: value }); }
            })
          ),
          renderAnimationPanel(attributes, setAttributes)
        ),
        createElement('section', blockProps,
          createElement('div', { className: 'trava-container' },
            createElement('div', { className: 'trava-cta__wrap' },
              ctaBackgroundUrl ? createElement('img', { src: ctaBackgroundUrl, alt: '' }) : null,
              createElement('div', { className: 'trava-cta__glass' },
                createElement('h2', {}, attributes.heading),
                createElement('p', {}, attributes.text),
                createElement('a', { className: 'trava-btn trava-btn--light', href: '#' },
                  attributes.ctaText,
                  createElement('span', { className: 'trava-btn__icon' }, renderIcon(attributes.btnIconType, attributes.btnIconClass, attributes.btnIconImage))
                )
              )
            )
          )
        )
      );
    },
    save: function () { return null; }
  });

  // FOOTER
  wp.blocks.registerBlockType('trava/footer', {
    title: 'Trava Footer',
    icon: 'admin-site',
    category: 'trava-blocks',
    attributes: {
      brandText: { type: 'string', default: 'TravAccount' },
      aboutText: { type: 'string', default: 'We are dedicated financial experts, providing top-notch accounting services to businesses of all sizes.' },
      supportText: { type: 'string', default: 'Our Support and Sales team is available 24/7 to answer your queries' },
      address: { type: 'string', default: '123 Main St, Suite 500, London, UK' },
      phone: { type: 'string', default: '01571273741' },
      navTitle: { type: 'string', default: 'Navigation' },
      navLinks: { type: 'array', default: [
        { label: 'Home', url: '#home' },
        { label: 'About Us', url: '#' },
        { label: 'Our Services', url: '#services' },
        { label: 'Our Team', url: '#' }
      ] },
      servicesTitle: { type: 'string', default: 'Services' },
      servicesLinks: { type: 'array', default: [
        { label: 'Bookkeeping', url: '#' },
        { label: 'VAT Returns', url: '#' },
        { label: 'Payroll Management', url: '#' },
        { label: 'Tax Preparation', url: '#' }
      ] },
      contactTitle: { type: 'string', default: 'Contact Us' },
      bottomLeft: { type: 'string', default: 'Copyright © 2025 TravAccount • Design by Zayd' },
      bottomRight: { type: 'string', default: 'Terms of Use • Privacy Policy' },
      twitterUrl: { type: 'string', default: '#' },
      instagramUrl: { type: 'string', default: '#' },
      youtubeUrl: { type: 'string', default: '#' },
      bgColor: { type: 'string', default: '#0F160C' },
      textColor: { type: 'string', default: '#DAE2EC' },
      headingColor: { type: 'string', default: '#ffffff' },
      linkColor: { type: 'string', default: '#DAE2EC' },
      linkHoverColor: { type: 'string', default: '#C9F054' },
      socialBg: { type: 'string', default: '#C9F054' },
      socialColor: { type: 'string', default: '#020618' },
      socialHoverBg: { type: 'string', default: '#E7FF80' },
      socialHoverColor: { type: 'string', default: '#0F160C' },
      borderColor: { type: 'string', default: 'rgba(218,226,236,.2)' },
      topGap: { type: 'number', default: 32 },
      topGapDesktop: { type: 'number', default: 80 },
      colsGap: { type: 'number', default: 24 },
      bottomGap: { type: 'number', default: 24 },
      linkGap: { type: 'number', default: 6 },
      padY: { type: 'number', default: 48 },
      textAnim: { type: 'string', default: 'none' },
      textAnimTrigger: { type: 'string', default: 'scroll' }
    },
    edit: function (editorProps) {
      var attributes = editorProps.attributes;
      var setAttributes = editorProps.setAttributes;
      var navLinks = getList(attributes.navLinks);
      var servicesLinks = getList(attributes.servicesLinks);
      var style = {
        padding: (attributes.padY || 48) + 'px 0',
        background: attributes.bgColor,
        color: attributes.textColor,
        '--trava-footer-bg': attributes.bgColor,
        '--trava-footer-text': attributes.textColor,
        '--trava-footer-heading': attributes.headingColor,
        '--trava-footer-link': attributes.linkColor,
        '--trava-footer-link-hover': attributes.linkHoverColor,
        '--trava-footer-social-bg': attributes.socialBg,
        '--trava-footer-social-color': attributes.socialColor,
        '--trava-footer-social-hover-bg': attributes.socialHoverBg,
        '--trava-footer-social-hover-color': attributes.socialHoverColor,
        '--trava-footer-border': attributes.borderColor,
        '--trava-footer-top-gap': (attributes.topGap || 32) + 'px',
        '--trava-footer-top-gap-desktop': (attributes.topGapDesktop || 80) + 'px',
        '--trava-footer-cols-gap': (attributes.colsGap || 24) + 'px',
        '--trava-footer-bottom-gap': (attributes.bottomGap || 24) + 'px',
        '--trava-footer-link-gap': (attributes.linkGap || 6) + 'px'
      };
      var blockProps = buildBlockProps('trava-footer', style, attributes);

      return createElement(Fragment, {},
        createElement(InspectorControls, {},
          createElement(PanelBody, { title: 'Footer', initialOpen: true },
            createElement(TextControl, { label: 'Brand Text', value: attributes.brandText, onChange: setAttr(setAttributes, 'brandText') }),
            createElement(TextareaControl, { label: 'About', value: attributes.aboutText, onChange: setAttr(setAttributes, 'aboutText') }),
            createElement(TextareaControl, { label: 'Contact Description', value: attributes.supportText, onChange: setAttr(setAttributes, 'supportText') }),
            createElement(TextControl, { label: 'Contact Title', value: attributes.contactTitle, onChange: setAttr(setAttributes, 'contactTitle') }),
            createElement(TextControl, { label: 'Address', value: attributes.address, onChange: setAttr(setAttributes, 'address') }),
            createElement(TextControl, { label: 'Phone', value: attributes.phone, onChange: setAttr(setAttributes, 'phone') }),
            createElement(TextControl, { label: 'Bottom Left Text', value: attributes.bottomLeft, onChange: setAttr(setAttributes, 'bottomLeft') }),
            createElement(TextControl, { label: 'Bottom Right Text', value: attributes.bottomRight, onChange: setAttr(setAttributes, 'bottomRight') })
          ),
          createElement(PanelBody, { title: 'Navigation Links', initialOpen: false },
            createElement(TextControl, { label: 'Title', value: attributes.navTitle, onChange: setAttr(setAttributes, 'navTitle') }),
            navLinks.map(function (item, index) {
              return createElement('div', { key: index, style: { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' } },
                createElement(TextControl, { label: 'Label', value: item.label || '', onChange: function (value) { setAttributes({ navLinks: updateItem(navLinks, index, { label: value }) }); } }),
                createElement(TextControl, { label: 'URL', value: item.url || '', onChange: function (value) { setAttributes({ navLinks: updateItem(navLinks, index, { url: value }) }); } }),
                createElement(Button, { isDestructive: true, onClick: function () { setAttributes({ navLinks: removeItem(navLinks, index) }); } }, 'Remove')
              );
            }),
            createElement(Button, { variant: 'secondary', onClick: function () { setAttributes({ navLinks: addItem(navLinks, { label: 'New Link', url: '#' }) }); } }, 'Add Link')
          ),
          createElement(PanelBody, { title: 'Services Links', initialOpen: false },
            createElement(TextControl, { label: 'Title', value: attributes.servicesTitle, onChange: setAttr(setAttributes, 'servicesTitle') }),
            servicesLinks.map(function (item, index) {
              return createElement('div', { key: index, style: { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' } },
                createElement(TextControl, { label: 'Label', value: item.label || '', onChange: function (value) { setAttributes({ servicesLinks: updateItem(servicesLinks, index, { label: value }) }); } }),
                createElement(TextControl, { label: 'URL', value: item.url || '', onChange: function (value) { setAttributes({ servicesLinks: updateItem(servicesLinks, index, { url: value }) }); } }),
                createElement(Button, { isDestructive: true, onClick: function () { setAttributes({ servicesLinks: removeItem(servicesLinks, index) }); } }, 'Remove')
              );
            }),
            createElement(Button, { variant: 'secondary', onClick: function () { setAttributes({ servicesLinks: addItem(servicesLinks, { label: 'New Link', url: '#' }) }); } }, 'Add Link')
          ),
          createElement(PanelBody, { title: 'Social Links', initialOpen: false },
            createElement(TextControl, { label: 'Twitter URL', value: attributes.twitterUrl, onChange: setAttr(setAttributes, 'twitterUrl') }),
            createElement(TextControl, { label: 'Instagram URL', value: attributes.instagramUrl, onChange: setAttr(setAttributes, 'instagramUrl') }),
            createElement(TextControl, { label: 'YouTube URL', value: attributes.youtubeUrl, onChange: setAttr(setAttributes, 'youtubeUrl') })
          ),
          createElement(PanelBody, { title: 'Style', initialOpen: false },
            createElement('p', {}, 'Background'),
            createElement(ColorPalette, { value: attributes.bgColor, onChange: setAttr(setAttributes, 'bgColor') }),
            createElement('p', {}, 'Text Color'),
            createElement(ColorPalette, { value: attributes.textColor, onChange: setAttr(setAttributes, 'textColor') }),
            createElement('p', {}, 'Heading Color'),
            createElement(ColorPalette, { value: attributes.headingColor, onChange: setAttr(setAttributes, 'headingColor') }),
            createElement('p', {}, 'Link Color'),
            createElement(ColorPalette, { value: attributes.linkColor, onChange: setAttr(setAttributes, 'linkColor') }),
            createElement('p', {}, 'Link Hover Color'),
            createElement(ColorPalette, { value: attributes.linkHoverColor, onChange: setAttr(setAttributes, 'linkHoverColor') }),
            createElement('p', {}, 'Social Background'),
            createElement(ColorPalette, { value: attributes.socialBg, onChange: setAttr(setAttributes, 'socialBg') }),
            createElement('p', {}, 'Social Icon Color'),
            createElement(ColorPalette, { value: attributes.socialColor, onChange: setAttr(setAttributes, 'socialColor') }),
            createElement('p', {}, 'Social Hover Background'),
            createElement(ColorPalette, { value: attributes.socialHoverBg, onChange: setAttr(setAttributes, 'socialHoverBg') }),
            createElement('p', {}, 'Social Hover Icon Color'),
            createElement(ColorPalette, { value: attributes.socialHoverColor, onChange: setAttr(setAttributes, 'socialHoverColor') }),
            createElement('p', {}, 'Border Color'),
            createElement(ColorPalette, { value: attributes.borderColor, onChange: setAttr(setAttributes, 'borderColor') })
          ),
          createElement(PanelBody, { title: 'Spacing', initialOpen: false },
            createElement(RangeControl, { label: 'Vertical padding (px)', min: 24, max: 140, value: attributes.padY, onChange: setAttr(setAttributes, 'padY') }),
            createElement(RangeControl, { label: 'Top Gap (px)', min: 16, max: 80, value: attributes.topGap, onChange: setAttr(setAttributes, 'topGap') }),
            createElement(RangeControl, { label: 'Top Gap Desktop (px)', min: 32, max: 140, value: attributes.topGapDesktop, onChange: setAttr(setAttributes, 'topGapDesktop') }),
            createElement(RangeControl, { label: 'Columns Gap (px)', min: 12, max: 80, value: attributes.colsGap, onChange: setAttr(setAttributes, 'colsGap') }),
            createElement(RangeControl, { label: 'Bottom Gap (px)', min: 12, max: 80, value: attributes.bottomGap, onChange: setAttr(setAttributes, 'bottomGap') }),
            createElement(RangeControl, { label: 'Link Gap (px)', min: 2, max: 16, value: attributes.linkGap, onChange: setAttr(setAttributes, 'linkGap') })
          ),
          renderAnimationPanel(attributes, setAttributes)
        ),
        createElement('footer', blockProps,
          createElement('div', { className: 'trava-container' },
            createElement('div', { className: 'trava-footer__top' },
              createElement('div', { className: 'trava-footer__brand' },
                createElement('h3', {}, attributes.brandText),
                createElement('p', {}, attributes.aboutText),
                createElement('div', { className: 'trava-social' },
                  createElement('a', { href: attributes.twitterUrl || '#' }, createElement('span', { className: 'icon-ablocks-twitter' })),
                  createElement('a', { href: attributes.instagramUrl || '#' }, createElement('span', { className: 'icon-ablocks-instagram' })),
                  createElement('a', { href: attributes.youtubeUrl || '#' }, createElement('span', { className: 'icon-ablocks-youtube' }))
                )
              ),
              createElement('div', { className: 'trava-footer__cols' },
                createElement('div', {},
                  createElement('h4', {}, attributes.navTitle || 'Navigation'),
                  navLinks.map(function (item, index) {
                    return createElement('a', { href: item.url || '#', key: index }, item.label || '');
                  })
                ),
                createElement('div', {},
                  createElement('h4', {}, attributes.servicesTitle || 'Services'),
                  servicesLinks.map(function (item, index) {
                    return createElement('a', { href: item.url || '#', key: index }, item.label || '');
                  })
                ),
                createElement('div', {},
                  createElement('h4', {}, attributes.contactTitle || 'Contact Us'),
                  createElement('p', {}, attributes.supportText || ''),
                  createElement('p', {}, attributes.address),
                  createElement('p', {}, attributes.phone)
                )
              )
            ),
            createElement('div', { className: 'trava-footer__bottom' },
              createElement('div', {}, attributes.bottomLeft || ''),
              createElement('div', {}, attributes.bottomRight || '')
            )
          )
        )
      );
    },
    save: function () { return null; }
  });
})(window.wp);
