// @ts-nocheck
import color from 'color';
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  MATERIAL: 'material',
  WEB: 'web',
};

const isIphoneX =
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (height === 812 || width === 812);

const guidelineBaseWidth = 750;
const guidelineBaseHeight = 1334;
let ratio = width / guidelineBaseWidth;
const scale = size => {
  if (ratio == 0) {
    ratio = 0.5;
  }
  return ratio * size;
};

const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const platform = Platform.OS;
const platformStyle = undefined;
const fontFamily = 'MulishMedium';
const fontFamilySemiBold = 'MulishSemiBold';
const fontFamilyMedium = 'MulishMedium';
const fontFamilyLight = 'MulishLight';
const fontFamilyBold = 'MulishBold';
const fontFamilyItalic = 'MulishItalic';
const fontFamilyRobotoMedium = 'RobotoMedium';
const fontFamilyRobotoRegular = 'RobotoRegular';
const fontFamilyIcielPantonBold = 'iCielPantonBold';
const fontFamilyIcielPantonSemiBold = 'iCielPantonSemiBold';
const fontFamilyAgrifont = 'agrifont';
const fontFamilyWinkySans = 'WinkySans';
const fontSize50 = scale(50); // 44px
const fontSize48 = scale(48); // 48px
const fontSize44 = scale(44); // 44px
const fontSize42 = scale(42); // 42px
const fontSize36 = scale(36); // 36px
const fontSize30 = scale(30); // 30px
const fontSize32 = scale(32); // 32px
const fontSize28 = scale(28); // 28px
const fontSize26 = scale(26); // 28px
const fontSize24 = scale(24); // 24px
const fontSize22 = scale(22); // 22px
const fontSize20 = scale(20); // 20px
const fontSize18 = scale(18); // 18px
const fontSizeExtraExtraLarge = fontSize44; //(platform === 'ios') ? 22 : 29; //44px :)
const fontSizeExtraLarge = scale(42); // (platform === 'ios') ? 21 : 28; //42px
const fontSizeMediumLarge = fontSize36; // (platform === 'ios') ? scale(34) : 23; //34px
const fontSizeLarge = fontSize32; //(platform === 'ios') ? scale(32) : scale(18); // 32px

const fontSizeSmall = fontSize26; // (platform === 'ios') ? 13 : 14; //26px
const fontSizeMediumSmall = fontSize24; // (platform === 'ios') ? 12 : 13; //24px
const fontSizeExtraSmall = fontSize22; // (platform === 'ios') ? 10 : 12; //20px
const fontSizeExtraExtraSmall = fontSize20; // (platform === 'ios') ? 10 : 12; //20px

const ColorDanger = '#DF3651';
const ColorWarning = '#F6BE00';
const ColorBlue = '#007DC7';
const ColorPurple = '#FF93B3';
const ColorBorder = '#C8C8C8';
const ColorTextPrimary = '#151b26';
const ColorTextSecondary = '#6f7782';
const ColorTextHint = '#BBBBBB';

const ColorMalachite = '#24A949'; //"#15B536";
const ColorGray11 = '#1C1C1C';
const ColorGray52 = '#858585';
const ColorGray92 = '#EBEBEB';
const ColorGray77 = '#c4c4c4';
const ColorGray73 = '#BABABA';
const ColorGray69 = '#B0B0B0';
const ColorGray97 = '#F7F7F7';
const ColorGrey = '#808080';
const ColorDustyGray = '#8B8B8B';
const ColorWhite = '#FFFFFF';
const ColorScorpion = '#5D5D5D';
const ColorMercury = '#E7E7E7';
const ColorBackgroundGray = '#F1F1F1';
const ColorReddish = '#E24F63';
const ColorBackgroundGray97 = '#F7F7F7';
const ColorMandy = '#E24F63';
const ColorMonza = '#D0011B';
const ColorSaffron = '#F9C02F';
const ColorS10 = '#EAECF0';
const listProductPadding = scale(20);
const contentPadding = scale(30);
const listItemProductWidth = (width - 2 * contentPadding - listProductPadding) / 2;
const listItemCategoryWidth = (width - 2 * contentPadding - 2 * listProductPadding) / 3;
const categoryThumbnailWidth = listItemCategoryWidth;
const categoryThumbnailHeight = (listItemCategoryWidth * 3) / 4;
const productThumbnailWidth = listItemProductWidth;
const productThumbnailHeight = (productThumbnailWidth * 3) / 4;

//ver 2
const colorPrimary = '#1ECC78';
const colorPrimaryLight = '#39FD9E';
const colorPrimary80 = '#4BD693';
const colorPrimary60 = '#78E0AE';
const colorPrimary40 = '#A5EBC9';
const colorPrimary20 = '#D2F5E4';
const colorPrimary10 = '#E8FAF1';
const colorPrimary05 = '#F4FDF8';

const colorSecondary = '#303E65';
const colorSecondaryLight = '#B3C0E0';
const colorSecondary80 = '#596584';
const colorSecondary60 = '#838BA3';
const colorSecondary40 = '#ACB2C1';
const colorSecondary20 = '#D6D8E0';
const neutral80 = '#7A8CB4';

const colorActive = '#1975FF';
const colorActive80 = '#4791FF';
const colorActive60 = '#75ACFF';
const colorActive40 = '#A3C8FF';
const colorActive20 = '#D1E3FF';

const colorError = '#FF0E39';
const colorError80 = '#FF3E61';
const colorError60 = '#FF6E88';
const colorError40 = '#FF9FB0';
const colorError20 = '#FFCFD7';
const colorError10 = '#FFE7EB';
const colorError05 = '#FFF3F5';

const colorPending = '#FF7940';
const colorPending80 = '#FF9466';
const colorPending60 = '#FFAF8C';
const colorPending40 = '#FFC9B3';
const colorPending20 = '#FFE4D9';
const colorPending10 = '#FFF2EC';
const colorPending05 = '#FFF8F6';

const colorNeutral80 = '#7A8CB4';
const colorNeutral60 = '#8793B4';
const colorNeutral40 = '#A3B0D6';
const colorNeutral20 = '#B3C0E0';
const colorNeutral10 = '#DCE7F9';
const colorNeutral04 = '#E4ECFF';
const colorNeutral02 = '#F5F9FF';

const colorViolet100 = '#BC88FF';
const colorViolet80 = '#CAA0FF';
const colorViolet60 = '#D7B8FF';

const colorBg1 = '#FFFFFF';
const colorBg2 = '#F3FBF9';
const colorBg3 = '#F2F7FF';
const colorBg4 = '#F7FBFA'; // main screen

const colorIconHeader = '#344268';

const backgroundContainer = '#F3FBF9';

const fs7 = 7;
const fs8 = 8;
const fs9 = 9.63;
const fs11 = 11.56;
const fs13 = 13;
const fs14 = 14.63;
const fs16 = 16.45;
const fs18 = 18.51;
const fs20 = 20.82;
const fs23 = 23.43;
const fs26 = 26.35;
const fs29 = 29.65;
const fs33 = 33.36;
const fs40 = 48;

const fontSizeBase = fs14; // (platform === 'ios') ? 14 : 15; // 28px

export default {
  isIphoneX,
  deviceWidth: width,
  deviceHeight: height,
  platformStyle,
  platform,

  // AndroidRipple
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',
  buttonUppercaseAndroidText: true,
  fontFamily,
  fontFamilySemiBold,
  fontFamilyMedium,
  fontFamilyLight,
  fontFamilyBold,
  fontFamilyItalic,
  fontFamilyRobotoMedium,
  fontFamilyRobotoRegular,
  fontFamilyIcielPantonBold,
  fontFamilyIcielPantonSemiBold,
  fontFamilyAgrifont,
  fontFamilyWinkySans,

  scale,
  verticalScale,
  // Color
  brandWarning: '#fc782e', //'#F6A623',
  brandPrimary: colorPrimary,
  brandDanger: ColorDanger,
  ColorWarning,
  ColorReddish,
  ColorPurple,
  ColorMalachite,
  ColorGray77,
  ColorGray11,
  ColorGray52,
  ColorGray69,
  ColorGray92,
  ColorGray97,
  ColorScorpion,
  ColorMercury,
  ColorGrey,
  ColorBackgroundGray,
  ColorBackgroundGray97,
  ColorWhite,
  ColorMandy,
  ColorMonza,
  ColorDanger,
  ColorSaffron,
  ColorGray73,
  ColorDustyGray,
  ColorS10,
  ColorBlue,
  fontSize48,
  fontSize50,
  fontSize44,
  fontSize42,
  fontSize36,
  fontSize30,
  fontSize32,
  fontSize28,
  fontSize24,
  fontSize22,
  fontSize20,
  fontSize18,
  defaultBg: '#F1F1F1',
  // Font
  fontSizeExtraExtraLarge,
  fontSizeExtraLarge,
  fontSizeMediumLarge,
  fontSizeLarge,
  fontSizeBase,
  fontSizeSmall,
  fontSizeMediumSmall,
  fontSizeExtraSmall,
  fontSizeExtraExtraSmall,

  // Accordion
  headerStyle: '#edebed',
  iconStyle: '#000',
  contentStyle: '#f5f4f5',
  expandedIconStyle: '#000',
  accordionBorderColor: ColorBorder,

  // ActionSheet
  elevation: 4,
  containerTouchableBackgroundColor: 'rgba(0,0,0,0.4)',
  innerTouchableBackgroundColor: '#fff',
  listItemHeight: 50,
  listItemBorderColor: 'transparent',
  marginHorizontal: -15,
  marginLeft: 14,
  marginTop: 15,
  minHeight: 56,
  padding: 15,
  touchableTextColor: '#757575',

  // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
  badgePadding: platform === PLATFORM.IOS ? 3 : 0,

  // Button
  buttonFontFamily: fontFamilyMedium,
  buttonDisabledBg: '#b5b5b5',
  buttonPadding: 6,
  get buttonPrimaryBg() {
    return this.brandPrimary;
  },
  get buttonPrimaryColor() {
    return this.inverseTextColor;
  },
  get buttonInfoBg() {
    return this.brandInfo;
  },
  get buttonInfoColor() {
    return this.inverseTextColor;
  },
  get buttonSuccessBg() {
    return this.brandSuccess;
  },
  get buttonSuccessColor() {
    return this.inverseTextColor;
  },
  get buttonDangerBg() {
    return this.brandDanger;
  },
  get buttonDangerColor() {
    return this.inverseTextColor;
  },
  get buttonWarningBg() {
    return this.brandWarning;
  },
  get buttonWarningColor() {
    return this.inverseTextColor;
  },
  get buttonTextSize() {
    return platform === PLATFORM.IOS ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
  },
  get buttonTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get buttonTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: '#fff',
  cardBorderColor: ColorBorder,
  cardItemPadding: platform === PLATFORM.IOS ? 10 : 12,

  // CheckBox
  CheckboxRadius: platform === PLATFORM.IOS ? 13 : 0,
  CheckboxBorderWidth: platform === PLATFORM.IOS ? 1 : 2,
  CheckboxPaddingLeft: platform === PLATFORM.IOS ? 4 : 2,
  CheckboxPaddingBottom: platform === PLATFORM.IOS ? 0 : 5,
  CheckboxIconSize: platform === PLATFORM.IOS ? 21 : 16,
  CheckboxIconMarginTop: platform === PLATFORM.IOS ? undefined : 1,
  CheckboxFontSize: platform === PLATFORM.IOS ? 23 / 0.9 : 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

  // Color
  brandInfo: ColorMalachite,
  brandSuccess: ColorMalachite,
  brandDark: '#000',
  brandLight: '#f4f4f4',

  // Container
  containerBgColor: 'transparent',

  // Date Picker
  datePickerTextColor: '#000',
  datePickerBg: 'transparent',

  // FAB
  fabWidth: 56,

  // Font
  DefaultFontSize: fontSizeBase,
  fontSizeBase: fontSizeBase,

  // Footer
  footerHeight: 55,
  footerDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: ColorTextPrimary,
  tabBarTextSize: platform === PLATFORM.IOS ? 14 : 11,
  activeTab: '#fff',
  sTabBarActiveTextColor: ColorMalachite,
  tabBarActiveTextColor: ColorMalachite,
  tabActiveBgColor: '#fff',

  // Header
  searchBarInputHeight: platform === PLATFORM.IOS ? 30 : 50,
  toolbarBtnTextColor: platform === PLATFORM.IOS ? '#007aff' : '#fff',
  get darkenHeader() {
    return color(this.tabBgColor).darken(0.03).hex();
  },

  // Line Height
  buttonLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,

  // List
  listBg: 'transparent',
  listTextSize: fontSize30,
  listNoteColor: '#808080',
  listNoteSize: 13,
  listItemSelected: platform === PLATFORM.IOS ? '#007aff' : '#3F51B5',

  // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',

  // Radio Button
  radioBtnSize: platform === PLATFORM.IOS ? 25 : 23,
  radioSelectedColorAndroid: '#3F51B5',
  radioBtnLineHeight: platform === PLATFORM.IOS ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: ColorWhite,
  segmentActiveBackgroundColor: ColorMalachite,
  segmentTextColor: ColorMalachite,
  segmentActiveTextColor: '#fff',
  segmentBorderColor: ColorMalachite,
  segmentBorderColorMain: '#3F51B5',

  // Spinner
  defaultSpinnerColor: '#45D56E',
  inverseSpinnerColor: '#1A191B',

  // Tab
  tabDefaultBg: '#fff',
  topTabBarTextColor: ColorTextPrimary,
  topTabBarActiveTextColor: ColorMalachite,
  topTabBarBorderColor: '#fff',
  topTabBarActiveBorderColor: ColorMalachite,

  // Text
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Other
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  inputGroupRoundedBorderRadius: 30,

  get fontSizeH1() {
    return fontSizeExtraExtraLarge;
  },
  get fontSizeH2() {
    return fontSizeExtraLarge;
  },
  get fontSizeH3() {
    return fontSizeMediumLarge;
  },

  // Text
  textColor: ColorTextPrimary,
  textColorSecondary: ColorTextSecondary,
  textColorHint: ColorTextHint,
  inverseTextColor: '#fff',
  lineHeight: platform === 'ios' ? 20 : 24,

  // Title
  titleFontfamily: fontFamily,
  titleFontSize: fs20,
  titleFontColor: colorSecondary,
  subTitleFontSize: fontSizeSmall, //(platform === 'ios') ? 12 : 14,
  subtitleColor: colorSecondary,

  // // Header
  toolbarBackBtnColor: colorSecondaryLight,
  toolbarBtnColor: colorIconHeader,
  toolbarDefaultBg: ColorWhite,
  toolbarHeight: platform === 'ios' ? scale(140) : scale(100),
  toolbarIconSize: platform === 'ios' ? 20 : 22,
  toolbarIconColor: ColorWhite,
  toolbarSearchIconSize: platform === 'ios' ? 20 : 23,
  toolbarInputColor: platform === 'ios' ? '#CECDD2' : '#fff',
  searchBarHeight: platform === 'ios' ? 30 : 40,
  toolbarInverseBg: '#222',
  toolbarTextColor: colorSecondary,
  iosStatusbar: 'dark-content',
  toolbarDefaultBorder: '#c9c9c9',
  toolbarPaddingTop: platform === 'ios' ? scale(40) : 0,

  get statusBarColor() {
    return this.toolbarDefaultBg;
  },

  //bottom tab
  bottomTabIconColor: '#3F3F3F',
  bottomTabSelectedIconColor: ColorMalachite,

  borderColor: ColorBorder,
  // List
  listBorderColor: ColorBorder,
  listDividerBg: ColorBackgroundGray,
  listItemHeight: scale(100),
  listBtnUnderlayColor: '#DDD',
  listItemPadding: contentPadding,
  listItemHPadding: contentPadding,
  listProductPadding: listProductPadding,
  listItemProductWidth: listItemProductWidth,
  productThumbnailWidth: productThumbnailWidth,
  listItemCategoryWidth: listItemCategoryWidth,
  productThumbnailHeight: productThumbnailHeight,
  categoryThumbnailWidth: categoryThumbnailWidth,
  categoryThumbnailHeight: categoryThumbnailHeight,

  //card

  cardBorderRadius: scale(10),

  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: platform === 'ios' ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: platform === 'ios' ? 34 : 24,

  iconBackSize: 17,

  // Tabs
  tabBgColor: ColorWhite,
  tabFontSize: 15,
  tabTextColor: ColorTextPrimary,

  // Other
  borderRadiusBase: platform === 'ios' ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: contentPadding,

  // style
  toolbarBtnStyle: {
    backgroundColor: colorNeutral10,
    padding: scale(20),
    borderRadius: scale(25),
    width: scale(70),
    height: scale(70),
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbnalEmptySize: 300,
  isScreenVertical: height > width ? true : false,
  //Temp need to config
  // // InputGroup
  inputFontSize: fontSizeBase,
  inputBorderColor: ColorBorder,
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',
  inputRounderRadius: scale(10),
  //button
  btnDisabledBg: '#b5b5b5',
  // eslint-disable-next-line no-dupe-keys
  buttonPadding: 0,

  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return '#575757';
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },
  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },

  //icon
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  // iPhoneX SafeArea
  Inset: isIphoneX
    ? {
        portrait: {
          topInset: 24,
          leftInset: 0,
          rightInset: 0,
          bottomInset: 34,
        },
        landscape: {
          topInset: 0,
          leftInset: 44,
          rightInset: 44,
          bottomInset: 21,
        },
      }
    : {
        portrait: {
          topInset: 0,
          leftInset: 0,
          rightInset: 0,
          bottomInset: 0,
        },
        landscape: {
          topInset: 0,
          leftInset: 0,
          rightInset: 0,
          bottomInset: 0,
        },
      },

  //ver 2
  colorPrimary,
  colorPrimaryLight,
  colorPrimary80,
  colorPrimary60,
  colorPrimary40,
  colorPrimary20,
  colorPrimary10,
  colorPrimary05,

  colorSecondary,
  colorSecondaryLight,
  colorSecondary80,
  colorSecondary60,
  colorSecondary40,
  colorSecondary20,
  neutral80,

  colorActive,
  colorActive80,
  colorActive60,
  colorActive40,
  colorActive20,

  colorError,
  colorError80,
  colorError60,
  colorError40,
  colorError20,
  colorError10,
  colorError05,

  colorPending,
  colorPending80,
  colorPending60,
  colorPending40,
  colorPending20,
  colorPending10,
  colorPending05,

  colorNeutral80,
  colorNeutral60,
  colorNeutral40,
  colorNeutral20,
  colorNeutral10,
  colorNeutral04,
  colorNeutral02,

  colorViolet100,
  colorViolet80,
  colorViolet60,

  colorBg1,
  colorBg2,
  colorBg3,
  backgroundContainer,
  colorBg4,
  colorIconHeader,

  fs7,
  fs8,
  fs9,
  fs11,
  fs13,
  fs14,
  fs16,
  fs18,
  fs20,
  fs23,
  fs26,
  fs29,
  fs33,
  fs40,
};
