import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import IconBookmark from '@/components/icons/IconBookmark.vue'
import IconBus from '@/components/icons/IconBus.vue'
import IconCall from '@/components/icons/IconCall.vue'
import IconCampaign from '@/components/icons/IconCampaign.vue'
import IconCar from '@/components/icons/IconCar.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconClock from '@/components/icons/IconClock.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconDisabledByDefault from '@/components/icons/IconDisabledByDefault.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconFax from '@/components/icons/IconFax.vue'
import IconFilter from '@/components/icons/IconFilter.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconMail from '@/components/icons/IconMail.vue'
import IconMenu from '@/components/icons/IconMenu.vue'
import IconOpenInNew from '@/components/icons/IconOpenInNew.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconPdf from '@/components/icons/IconPdf.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconProgressActivity from '@/components/icons/IconProgressActivity.vue'
import IconQuestion from '@/components/icons/IconQuestion.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconSort from '@/components/icons/IconSort.vue'
import IconTrain from '@/components/icons/IconTrain.vue'
import IconWarning from '@/components/icons/IconWarning.vue'

export const iconMap = {
  'arrow-down': IconArrowDown,
  'arrow-left': IconArrowLeft,
  'arrow-right': IconArrowRight,
  'arrow-up': IconArrowUp,
  bookmark: IconBookmark,
  bus: IconBus,
  call: IconCall,
  campaign: IconCampaign,
  car: IconCar,
  check: IconCheck,
  'chevron-right': IconChevronRight,
  clock: IconClock,
  close: IconClose,
  'disabled-by-default': IconDisabledByDefault,
  download: IconDownload,
  fax: IconFax,
  filter: IconFilter,
  info: IconInfo,
  mail: IconMail,
  menu: IconMenu,
  'open-in-new': IconOpenInNew,
  pause: IconPause,
  pdf: IconPdf,
  play: IconPlay,
  'progress-activity': IconProgressActivity,
  question: IconQuestion,
  search: IconSearch,
  sort: IconSort,
  train: IconTrain,
  warning: IconWarning,
} as const

export type Icon = keyof typeof iconMap
