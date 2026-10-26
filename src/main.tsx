import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { sendBookingRequest } from './bookingService'
import type { BookingRequest } from './bookingService'
import './styles.css'

type Room = {
  name: string
  description: string
  image: string
  amenities: string[]
  gallery: string[]
}

const roomPrice = 'От 2500 ₽'
const publicImage = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`

const rooms: Room[] = [
  {
    name: 'Одноместный номер',
    description: 'Одноместный номер от 16 кв. м. с односпальной кроватью и ванной комнатой.',
    image: publicImage('room-single.jpg'),
    amenities: ['Односпальная кровать', 'Собственная ванная комната', 'Кондиционер', 'Телевизор с плоским экраном'],
    gallery: [publicImage('room-single.jpg')],
  },
  {
    name: 'Двухместный номер',
    description: 'Твин 16 кв. м. с двумя односпальными кроватями и собственной ванной комнатой.',
    image: publicImage('room-double.jpg'),
    amenities: ['Две односпальные кровати', 'Собственная ванная комната', 'Кондиционер', 'Телевизор с плоским экраном'],
    gallery: [publicImage('room-double.jpg'), publicImage('room-twin-dark.jpg')],
  },
  {
    name: 'Улучшенный номер',
    description: 'Двухместный номер 21 кв. м. с одной двуспальной кроватью и ванной комнатой.',
    image: publicImage('room-superior.jpg'),
    amenities: ['Двуспальная кровать', 'Собственная ванная комната', 'Кондиционер', 'Телевизор с плоским экраном'],
    gallery: [publicImage('room-superior.jpg')],
  },
  {
    name: 'Апартаменты',
    description: 'Трехместный номер с тремя кроватями и отдельным входом, кухней и ванной комнатой.',
    image: publicImage('room-apartment.jpg'),
    amenities: ['Три односпальные кровати', 'Собственная ванная комната', 'Кондиционер', 'Телевизор с плоским экраном'],
    gallery: [publicImage('room-apartment.jpg')],
  },
]

const navItems = [
  ['О нас', '#about'],
  ['Номера', '#rooms'],
  ['Услуги', '#services'],
  ['Галерея', '#rooms'],
  ['Контакты', '#contacts'],
]

function Brand({ onClick }: { onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return <a className="brand" href="#top" onClick={onClick} aria-label="Отель Вознесенский — на главную"><span className="brand-mark">B</span></a>
}

function VkIcon() {
  return (
    <svg className="vk-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" />
      <path d="M5.4 9.2h2.2c.2 0 .4.1.5.4.7 2.1 2 3.9 2.5 3.9.2 0 .3-.2.3-.6v-2.2c0-1-.6-1.1-.6-1.5 0-.2.1-.4.4-.4H13c.3 0 .4.2.4.5v3.1c0 .3.1.5.2.5.2.1.4 0 .7-.4 1-1.1 1.7-2.9 1.7-2.9.1-.2.2-.4.6-.4h1.5c.4 0 .5.2.4.5-.2.8-2 3.3-2 3.3-.1.2-.2.3 0 .6.1.2.6.6 1 1 .6.6 1 1.1 1.1 1.4.1.4-.1.6-.5.6h-1.5c-.6 0-.8-.5-1.7-1.4-.9-.9-1.3-1-1.5-1-.3 0-.4.1-.4.5v1.3c0 .4-.2.6-1.1.6-1.6 0-3.3-1-4.5-2.7-1.8-2.5-2.3-4.4-2.3-4.9 0-.2.1-.4.5-.4Z" />
    </svg>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigateTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    const target = document.getElementById(href.slice(1))
    if (!target) return

    event.preventDefault()
    setMenuOpen(false)
    window.history.pushState(null, '', href)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const header = document.querySelector<HTMLElement>('.site-header')
        const top = href === '#top'
          ? 0
          : window.scrollY + target.getBoundingClientRect().top - (header?.getBoundingClientRect().height ?? 0) - 28
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        window.scrollTo({ top: Math.max(0, top), behavior })
      })
    })
  }

  return (
    <header className="site-header" id="top">
      <div className="header-inner">
        <Brand onClick={(event) => navigateTo(event, '#top')} />
        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Основная навигация">
          <span className="navigation-heading">Разделы сайта</span>
          {navItems.map(([label, href]) => (
            <a key={label} href={href} onClick={(event) => navigateTo(event, href)}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href="tel:+79214638683">+7 921 463 86 83</a>
          <a className="social-link" href="https://vk.com/vozhotel12345" target="_blank" rel="noreferrer" aria-label="Отель во ВКонтакте"><VkIcon /></a>
          <a className="button button-small" href="tel:+79214638683">Позвонить</a>
        </div>
      </div>
    </header>
  )
}

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src={publicImage('hotel-exterior.jpg')} alt="Современное здание отеля «Вознесенский»" />
      <div className="hero-shade" />
      <div className="hero-copy">
        <h1 id="hero-title"><span className="hero-title-first">ОТЕ<span className="hero-title-last">ЛЬ</span></span><br />ВОЗНЕСЕНСКИЙ</h1>
        <p className="hero-subtitle">Уют и тишина Карелии в 10 минутах от центра</p>
        <p className="hero-description">Номера из натурального дерева в окружении леса.<br className="desktop-break" /> Загородное спокойствие, бесплатная парковка,<br className="desktop-break" /> быстрый выезд на главные маршруты.</p>
        <button className="button hero-button" type="button" onClick={onBook}>ЗАБРОНИРОВАТЬ</button>
      </div>
    </section>
  )
}

const aboutBlocks = [
  {
    title: 'Самое важное',
    text: 'Современный отель на въезде в Петрозаводск «Вознесенский» идеально подходит для тех, кто ценит спокойный отдых в тихом месте с отличным соотношением цены, качества и доступности городского центра.',
    image: publicImage('hotel-side.jpg'),
    alt: 'Фасад отеля «Вознесенский»',
    className: 'about-first',
  },
  {
    title: 'Продуманный комфорт и сервис',
    text: 'В нашем уютном отеле номера со всеми необходимыми удобствами (ТВ, холодильник, чайник, фен), бесплатный Wi-Fi на всей территории, собственная парковка.',
    image: publicImage('room-wood.jpg'),
    alt: 'Интерьер номера из натурального дерева',
    className: 'about-second',
  },
  {
    title: 'Все нужное рядом',
    text: 'Ресторан в 100 метрах от отеля, до центра города 10–15 минут на автомобиле, а дорога до аэропорта займет около 30 минут.',
    image: publicImage('room-twin-dark.jpg'),
    alt: 'Уютный двухместный номер',
    className: 'about-third',
  },
]

function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-content">
        {aboutBlocks.map((block) => (
          <article
            className={`about-row ${block.className}`}
            id={block.title === 'Продуманный комфорт и сервис' ? 'services' : undefined}
            key={block.title}
          >
            <div className="about-copy">
              {block.className === 'about-first' && <h2 id="about-title" className="about-heading">О нас</h2>}
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </div>
            <img src={block.image} alt={block.alt} loading="eager" decoding="async" />
          </article>
        ))}
      </div>
      <div className="ornament ornament-about" aria-hidden="true" />
    </section>
  )
}

function RoomCard({ room, onBook, onGallery }: { room: Room; onBook: (name: string) => void; onGallery: (room: Room) => void }) {
  return (
    <article className="room-card">
      <div className="room-photo-frame">
        <img className="room-photo" src={room.image} alt={room.name} loading="eager" decoding="async" />
      </div>
      <div className="room-info">
        <div className="room-heading">
          <h3 className="room-name">{room.name}</h3>
          <span className="room-price">{roomPrice}</span>
        </div>
        <p className="room-description">{room.description}</p>
        <ul className="amenities">
          {room.amenities.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <ul className="stay-rules">
          <li>Заезд с 14:00</li>
          <li>Выезд до 12:00</li>
          <li>Оплата при заселении</li>
        </ul>
        <div className="room-actions">
          <button className="button" type="button" onClick={() => onBook(room.name)}>Забронировать</button>
          <button className="button button-outline" type="button" onClick={() => onGallery(room)}>Смотреть фото</button>
        </div>
      </div>
    </article>
  )
}

function Rooms({ onBook, onGallery }: { onBook: (name: string) => void; onGallery: (room: Room) => void }) {
  return (
    <section className="rooms-section" id="rooms" aria-labelledby="rooms-title">
      <div className="section-container">
        <h2 id="rooms-title" className="section-title">Наши номера</h2>
        <p className="rooms-intro">Откройте для себя идеальное сочетание домашнего уюта и безупречного отельного сервиса в наших номерах. Мы продумали каждую деталь — от ортопедических матрасов до стильного интерьера, чтобы ваше пребывание было максимально комфортным и незабываемым.</p>
        <div className="room-list">
          {rooms.map((room) => <RoomCard key={room.name} room={room} onBook={onBook} onGallery={onGallery} />)}
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  const mapLink = 'https://yandex.ru/maps/?text=' + encodeURIComponent('Петрозаводск, Вознесенское шоссе, 18')
  return (
    <section className="contacts-section" id="contacts" aria-labelledby="contacts-title">
      <div className="contacts-frame">
        <div className="contact-info">
          <h2 id="contacts-title" className="contact-title">Контактная информация</h2>
          <dl>
            <div><dt>Номер телефона:</dt><dd><a href="tel:+79114638683">+7 911 463 86 83</a></dd></div>
            <div><dt>Отдел бронирования:</dt><dd><a href="tel:+79214638683">+7 921 463 86 83</a></dd></div>
            <div><dt>E-mail:</dt><dd><a href="mailto:vozhotel@yandex.ru">vozhotel@yandex.ru</a></dd></div>
            <div><dt>Группа ВКонтакте:</dt><dd><a href="https://vk.com/vozhotel12345" target="_blank" rel="noreferrer">https://vk.com/vozhotel12345</a></dd></div>
            <div><dt>Адрес:</dt><dd>Петрозаводск, Вознесенское шоссе, 18</dd></div>
          </dl>
          <a className="contact-vk" href="https://vk.com/vozhotel12345" target="_blank" rel="noreferrer" aria-label="Открыть ВКонтакте"><VkIcon /></a>
        </div>
        <a className="map-card" href={mapLink} target="_blank" rel="noreferrer" aria-label="Открыть адрес отеля на карте">
          <div className="map-art" aria-hidden="true">
            <span className="map-water" /><span className="map-road road-one" /><span className="map-road road-two" />
            <span className="map-block block-one" /><span className="map-block block-two" /><span className="map-block block-three" />
            <span className="map-pin">●</span>
            <span className="map-label">Вознесенское ш., 18</span>
          </div>
          <span className="map-caption">Открыть карту</span>
        </a>
      </div>
    </section>
  )
}

function Modal({ title, onClose, children, className = '' }: { title: string; onClose: () => void; children: React.ReactNode; className?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement
    const bodyOverflow = document.body.style.overflow
    const bodyPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `calc(${getComputedStyle(document.body).paddingRight} + ${scrollbarWidth}px)`
    }
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (event.target instanceof Element && event.target.closest('.date-calendar')) return
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, input, textarea, select, a[href], [tabindex="0"]')]
        .filter((element) => !element.hasAttribute('disabled'))
      const calendar = document.querySelector<HTMLElement>('.date-calendar')
      const calendarButtons = calendar
        ? [...calendar.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')]
        : []
      const calendarTrigger = dialogRef.current.querySelector<HTMLButtonElement>('.date-icon-button[aria-expanded="true"]')
      const calendarInput = dialogRef.current.querySelector<HTMLInputElement>('.date-picker input[aria-expanded="true"]')
      const activeCalendarIndex = calendarButtons.indexOf(document.activeElement as HTMLButtonElement)
      if (calendarTrigger && !event.shiftKey && (document.activeElement === calendarTrigger || document.activeElement === calendarInput) && calendarButtons.length) {
        event.preventDefault()
        calendarButtons[0].focus()
        return
      }
      if (activeCalendarIndex >= 0) {
        event.preventDefault()
        if (event.shiftKey) {
          if (activeCalendarIndex === 0) calendarTrigger?.focus()
          else calendarButtons[activeCalendarIndex - 1].focus()
        } else if (activeCalendarIndex === calendarButtons.length - 1) {
          const triggerIndex = calendarTrigger ? focusable.indexOf(calendarTrigger) : -1
          const nextElement = focusable[triggerIndex + 1] ?? focusable[0]
          nextElement?.focus()
        } else {
          calendarButtons[activeCalendarIndex + 1].focus()
        }
        return
      }
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = bodyOverflow
      document.body.style.paddingRight = bodyPaddingRight
      previousFocus.current?.focus()
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
        <div className="modal-content">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}

type FieldErrors = Partial<Record<keyof BookingRequest, string>>

function addDays(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day + days)
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function formatDate(isoDate: string) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

function formatDateEntry(rawValue: string) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 4) return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
  if (digits.length > 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return digits
}

function parseDateEntry(entry: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(entry)
  if (!match) return ''
  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return ''
  return `${year}-${month}-${day}`
}

function DatePicker({ value, min, invalid, describedBy, label, onChange, onBlur }: {
  value: string
  min: string
  invalid: boolean
  describedBy?: string
  label: string
  onChange: (value: string) => void
  onBlur: (value: string, invalidFormat: boolean) => void
}) {
  const pickerRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const preserveDraftRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => formatDate(value))
  const [position, setPosition] = useState({ left: 0, top: 0, width: 300 })
  const selected = value ? new Date(`${value}T00:00:00`) : null
  const minDate = new Date(`${min}T00:00:00`)
  const [shownMonth, setShownMonth] = useState(() => {
    const date = selected ?? (minDate > new Date() ? minDate : new Date())
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const monthLabel = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(shownMonth)
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const firstDay = (shownMonth.getDay() + 6) % 7
  const daysInMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })
  const minimumMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1)

  useEffect(() => {
    if (preserveDraftRef.current) {
      preserveDraftRef.current = false
      return
    }
    setDraft(formatDate(value))
  }, [value])

  const updatePosition = () => {
    const anchor = pickerRef.current?.querySelector<HTMLButtonElement>('.date-icon-button')
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    const width = Math.min(320, window.innerWidth - 32)
    const left = Math.max(16, Math.min(rect.right - width, window.innerWidth - width - 16))
    const estimatedHeight = 350
    const top = rect.bottom + estimatedHeight + 12 <= window.innerHeight
      ? rect.bottom + 8
      : Math.max(12, rect.top - estimatedHeight - 8)
    setPosition({ left, top, width })
  }

  useEffect(() => {
    if (!open) return
    updatePosition()
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !pickerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setOpen(false)
        pickerRef.current?.querySelector('input')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  const openCalendar = () => {
    const draftDate = parseDateEntry(draft)
    const currentDate = draftDate ? new Date(`${draftDate}T00:00:00`) : selected
    const displayDate = currentDate && draftDate >= min ? currentDate : minDate
    setShownMonth(new Date(displayDate.getFullYear(), displayDate.getMonth(), 1))
    setOpen(true)
  }

  const commitDraft = () => {
    const parsed = parseDateEntry(draft)
    const invalidFormat = Boolean(draft) && !parsed
    preserveDraftRef.current = invalidFormat && Boolean(value)
    if (parsed && parsed < min) {
      onBlur(parsed, false)
      return
    }
    onBlur(parsed, invalidFormat)
  }

  return (
    <span className={`input-wrap date-picker${value ? ' has-date-value' : ''}`} ref={pickerRef}>
      <input
        ref={inputRef}
        className="date-input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={draft}
        placeholder="дд.мм.гггг"
        onChange={(event) => {
          const input = event.currentTarget
          const digitsBeforeCursor = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length
          const formatted = formatDateEntry(input.value)
          setDraft(formatted)
          requestAnimationFrame(() => {
            const cursor = digitsBeforeCursor + (digitsBeforeCursor > 4 ? 2 : digitsBeforeCursor > 2 ? 1 : 0)
            inputRef.current?.setSelectionRange(cursor, cursor)
          })
        }}
        onBlur={(event) => {
          if (event.relatedTarget instanceof Node && pickerRef.current?.contains(event.relatedTarget)) return
          commitDraft()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            inputRef.current?.blur()
          }
        }}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
      <button className="date-icon-button" type="button" onClick={openCalendar} aria-label={`Выбрать ${label.toLowerCase()}`} aria-expanded={open}>
        <svg className="date-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
          <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
        </svg>
      </button>
      {open && createPortal(
        <div className="date-calendar" ref={popoverRef} role="dialog" aria-label={`Календарь: ${label.toLowerCase()}`} style={{ left: position.left, top: position.top, width: position.width }}>
          <div className="calendar-header">
            <button
              className="calendar-month-button"
              type="button"
              aria-label="Предыдущий месяц"
              disabled={shownMonth <= minimumMonth}
              onClick={() => setShownMonth(new Date(shownMonth.getFullYear(), shownMonth.getMonth() - 1, 1))}
            >‹</button>
            <span className="calendar-month-label">{monthLabel}</span>
            <button className="calendar-month-button" type="button" aria-label="Следующий месяц" onClick={() => setShownMonth(new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1))}>›</button>
          </div>
          <div className="calendar-grid" role="grid" aria-label={monthLabel}>
            {weekdays.map((day) => <span className="calendar-weekday" role="columnheader" key={day}>{day}</span>)}
            {days.map((day, index) => {
              if (!day) return <span className="calendar-empty" role="gridcell" key={`empty-${index}`} />
              const date = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), day)
              const isoDate = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-')
              const disabled = isoDate < min
              const isSelected = value === isoDate
              const current = new Date()
              const isToday = isoDate === [current.getFullYear(), String(current.getMonth() + 1).padStart(2, '0'), String(current.getDate()).padStart(2, '0')].join('-')
              return (
                <button
                  className={`calendar-day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                  type="button"
                  key={isoDate}
                  disabled={disabled}
                  aria-label={date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(isoDate)
                    setDraft(formatDate(isoDate))
                    setOpen(false)
                    requestAnimationFrame(() => inputRef.current?.focus())
                  }}
                >{day}</button>
              )
            })}
          </div>
        </div>,
        document.body,
      )}
    </span>
  )
}

function BookingModal({ initialRoom, onClose, onSuccess }: { initialRoom: string; onClose: () => void; onSuccess: (request: BookingRequest) => void }) {
  const modalScrollTop = useRef(0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [validated, setValidated] = useState<Partial<Record<keyof BookingRequest, boolean>>>({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [form, setForm] = useState<BookingRequest>({
    fullName: '', phone: '', email: '', checkIn: '', checkOut: '', room: initialRoom, wishes: '', consent: false,
  })
  const now = new Date()
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')

  const update = (name: keyof BookingRequest, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined }))
    setValidated((previous) => ({ ...previous, [name]: false }))
  }

  const validateField = (name: keyof BookingRequest) => {
    let message = ''
    switch (name) {
      case 'fullName':
        if (!form.fullName.trim()) message = 'Укажите ваше имя.'
        break
      case 'phone':
        if (!form.phone.trim()) message = 'Укажите номер телефона.'
        else if (form.phone.replace(/\D/g, '').length < 10) message = 'Проверьте номер телефона.'
        break
      case 'email':
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) message = 'Введите корректный адрес электронной почты.'
        break
      case 'checkIn':
        if (!form.checkIn) message = 'Укажите дату заезда.'
        else if (form.checkIn < today) message = 'Дата заезда не может быть в прошлом.'
        break
      case 'checkOut':
        if (!form.checkOut) message = 'Укажите дату выезда.'
        else if (form.checkIn && form.checkOut <= form.checkIn) message = 'Выезд должен быть позже заезда.'
        break
      case 'room':
        if (!form.room) message = 'Выберите интересующий номер.'
        break
      case 'consent':
        if (!form.consent) message = 'Необходимо согласие на обработку данных.'
        break
      default:
        break
    }
    setErrors((previous) => ({ ...previous, [name]: message || undefined }))
    setValidated((previous) => ({ ...previous, [name]: !message && Boolean(form[name]) }))
  }

  const commitDate = (name: 'checkIn' | 'checkOut', value: string, invalidFormat: boolean) => {
    const nextForm = { ...form, [name]: value }
    const clearCheckOut = name === 'checkIn' && (!value || (form.checkOut && form.checkOut <= value))
    if (clearCheckOut) nextForm.checkOut = ''
    setForm(nextForm)

    let message = ''
    if (invalidFormat) message = 'Введите дату в формате день.месяц.год.'
    else if (!value) message = name === 'checkIn' ? 'Укажите дату заезда.' : 'Укажите дату выезда.'
    else if (name === 'checkIn' && value < today) message = 'Дата заезда не может быть в прошлом.'
    else if (name === 'checkOut' && form.checkIn && value <= form.checkIn) message = 'Выезд должен быть позже заезда.'

    setErrors((previous) => ({
      ...previous,
      [name]: message || undefined,
      ...(clearCheckOut ? { checkOut: undefined } : {}),
    }))
    setValidated((previous) => ({
      ...previous,
      [name]: !message && Boolean(value),
      ...(clearCheckOut ? { checkOut: false } : {}),
    }))
  }

  const validate = () => {
    const next: FieldErrors = {}
    if (!form.fullName.trim()) next.fullName = 'Укажите ваше имя.'
    if (!form.phone.trim()) next.phone = 'Укажите номер телефона.'
    else if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Проверьте номер телефона.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Введите корректный адрес электронной почты.'
    if (!form.checkIn) next.checkIn = 'Укажите дату заезда.'
    else if (form.checkIn < today) next.checkIn = 'Дата заезда не может быть в прошлом.'
    if (!form.checkOut) next.checkOut = 'Укажите дату выезда.'
    else if (form.checkIn && form.checkOut <= form.checkIn) next.checkOut = 'Выезд должен быть позже заезда.'
    if (!form.room) next.room = 'Выберите интересующий номер.'
    if (!form.consent) next.consent = 'Необходимо согласие на обработку данных.'
    setErrors(next)
    setValidated({
      fullName: !next.fullName && Boolean(form.fullName.trim()),
      phone: !next.phone && Boolean(form.phone.trim()),
      email: !next.email && Boolean(form.email),
      checkIn: !next.checkIn && Boolean(form.checkIn),
      checkOut: !next.checkOut && Boolean(form.checkOut),
      room: !next.room && Boolean(form.room),
      consent: !next.consent && form.consent,
    })
    return Object.keys(next).length === 0
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSendError('')
    if (sending) return
    if (!validate()) {
      const formElement = event.currentTarget
      const modal = formElement.closest<HTMLElement>('.modal-content')
      requestAnimationFrame(() => {
        if (!modal) return
        modal.scrollTop = modalScrollTop.current
        formElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus({ preventScroll: true })
      })
      return
    }
    setSending(true)
    try {
      await sendBookingRequest(form)
      onSuccess(form)
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Не удалось отправить заявку. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  const fieldClass = (key: keyof BookingRequest) => errors[key] ? 'field has-error' : validated[key] ? 'field is-valid' : 'field'

  return (
    <Modal title="Форма бронирования" onClose={onClose} className="booking-modal">
      <form className="booking-form" onSubmit={submit} noValidate>
        <label className={fieldClass('fullName')}>
          <span className="field-label-text">ФИО <span className="required">*</span></span>
          <span className="input-wrap">
            <input required value={form.fullName} onBlur={() => validateField('fullName')} onChange={(e) => update('fullName', e.target.value)} autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'error-fullName' : undefined} />
            {(validated.fullName || errors.fullName) && <span className="field-status" aria-hidden="true">{errors.fullName ? '×' : '✓'}</span>}
          </span>
          <span className={`field-error${errors.fullName ? '' : ' is-empty'}`} id="error-fullName" aria-hidden={!errors.fullName}>{errors.fullName || '\u00a0'}</span>
        </label>
        <label className={fieldClass('phone')}>
          <span className="field-label-text">Номер телефона <span className="required">*</span></span>
          <span className="input-wrap">
            <input required type="tel" value={form.phone} onBlur={() => validateField('phone')} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'error-phone' : undefined} />
            {(validated.phone || errors.phone) && <span className="field-status" aria-hidden="true">{errors.phone ? '×' : '✓'}</span>}
          </span>
          <span className={`field-error${errors.phone ? '' : ' is-empty'}`} id="error-phone" aria-hidden={!errors.phone}>{errors.phone || '\u00a0'}</span>
        </label>
        <label className={fieldClass('email')}>
          <span className="field-label-text">Электронная почта</span>
          <span className="input-wrap">
            <input type="email" value={form.email} onBlur={() => validateField('email')} onChange={(e) => update('email', e.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} />
            {(validated.email || errors.email) && <span className="field-status" aria-hidden="true">{errors.email ? '×' : '✓'}</span>}
          </span>
          <span className={`field-error${errors.email ? '' : ' is-empty'}`} id="error-email" aria-hidden={!errors.email}>{errors.email || '\u00a0'}</span>
        </label>
        <fieldset className="date-fields" aria-label="Даты заезда и выезда">
          <label className={fieldClass('checkIn')}>
            <span className="field-label-text">Заезд <span className="required">*</span></span>
            <DatePicker value={form.checkIn} min={today} invalid={Boolean(errors.checkIn)} describedBy={errors.checkIn ? 'error-checkIn' : undefined} label="Дата заезда" onBlur={(value, invalidFormat) => commitDate('checkIn', value, invalidFormat)} onChange={(value) => {
              update('checkIn', value)
              if (form.checkOut && form.checkOut <= value) update('checkOut', '')
            }} />
            <span className={`field-error${errors.checkIn ? '' : ' is-empty'}`} id="error-checkIn" aria-hidden={!errors.checkIn}>{errors.checkIn || '\u00a0'}</span>
          </label>
          <label className={fieldClass('checkOut')}>
            <span className="field-label-text">Выезд <span className="required">*</span></span>
            <DatePicker value={form.checkOut} min={form.checkIn ? addDays(form.checkIn, 1) : today} invalid={Boolean(errors.checkOut)} describedBy={errors.checkOut ? 'error-checkOut' : undefined} label="Дата выезда" onBlur={(value, invalidFormat) => commitDate('checkOut', value, invalidFormat)} onChange={(value) => update('checkOut', value)} />
            <span className={`field-error${errors.checkOut ? '' : ' is-empty'}`} id="error-checkOut" aria-hidden={!errors.checkOut}>{errors.checkOut || '\u00a0'}</span>
          </label>
        </fieldset>
        <fieldset className={`room-choice ${fieldClass('room')}`}>
          <legend><span className="field-label-text">Интересующий номер <span className="required">*</span></span></legend>
          {rooms.map((room) => (
            <label className="radio-option" key={room.name}>
              <input required type="radio" name="room" value={room.name} checked={form.room === room.name} onBlur={() => validateField('room')} onChange={(e) => update('room', e.target.value)} aria-invalid={Boolean(errors.room)} aria-describedby={errors.room ? 'error-room' : undefined} />
              <span className="room-option-name">{room.name}</span>
              <span className="room-option-price">{roomPrice}</span>
            </label>
          ))}
          <span className={`field-error${errors.room ? '' : ' is-empty'}`} id="error-room" aria-hidden={!errors.room}>{errors.room || '\u00a0'}</span>
        </fieldset>
        <label className="field">Особые пожелания
          <textarea rows={3} value={form.wishes} onChange={(e) => update('wishes', e.target.value)} />
        </label>
        <label className={`consent ${fieldClass('consent')}`}>
          <input required type="checkbox" checked={form.consent} onBlur={() => validateField('consent')} onChange={(e) => update('consent', e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'error-consent' : undefined} />
          <span>Я согласен(на) на обработку персональных данных <span className="required">*</span></span>
        </label>
        <span className={`field-error consent-error${errors.consent ? '' : ' is-empty'}`} id="error-consent" aria-hidden={!errors.consent}>{errors.consent || '\u00a0'}</span>
        {sendError && <p className="submit-error" role="alert">{sendError}</p>}
        <button className="button submit-button" type="submit" disabled={sending} onPointerDown={(event) => {
          modalScrollTop.current = event.currentTarget.closest<HTMLElement>('.modal-content')?.scrollTop ?? 0
        }}>{sending ? 'Отправка…' : 'Оставить заявку'}</button>
      </form>
    </Modal>
  )
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Большое спасибо!" onClose={onClose} className="success-modal">
      <p>Мы скоро с вами свяжемся!</p>
      <span className="success-check" aria-label="Успешно отправлено">✓</span>
    </Modal>
  )
}

function GalleryModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const change = (step: number) => setIndex((value) => (value + step + room.gallery.length) % room.gallery.length)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (room.gallery.length < 2) return
    if (event.key === 'ArrowRight') change(1)
    if (event.key === 'ArrowLeft') change(-1)
  }
  return (
    <Modal title={room.name} onClose={onClose} className="gallery-modal">
      <div className="gallery-view" onKeyDown={onKeyDown} tabIndex={0} aria-label="Галерея фотографий номера">
        <img src={room.gallery[index]} alt={`${room.name}, фото ${index + 1}`} />
        {room.gallery.length > 1 && <div className="gallery-controls">
          <button type="button" aria-label="Предыдущее фото" onClick={() => change(-1)}>‹</button>
          <span>{index + 1} / {room.gallery.length}</span>
          <button type="button" aria-label="Следующее фото" onClick={() => change(1)}>›</button>
        </div>}
      </div>
    </Modal>
  )
}

function App() {
  const [modal, setModal] = useState<'booking' | 'success' | 'gallery' | null>(null)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [galleryRoom, setGalleryRoom] = useState<Room>(rooms[0])
  const modalTrigger = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const elements = document.querySelectorAll<HTMLElement>(
      '.hero-copy, .about-heading, .about-row, .rooms-section .section-title, .rooms-intro, .room-card, .contacts-frame',
    )
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })

    elements.forEach((element) => {
      element.classList.add('reveal-on-scroll')
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const openBooking = (room = '') => {
    modalTrigger.current = document.activeElement as HTMLElement
    setSelectedRoom(room)
    setModal('booking')
  }
  const closeModal = useCallback(() => {
    setModal(null)
    requestAnimationFrame(() => modalTrigger.current?.focus())
  }, [])
  const showGallery = (room: Room) => {
    modalTrigger.current = document.activeElement as HTMLElement
    setGalleryRoom(room)
    setModal('gallery')
  }

  return (
    <>
      <Header />
      <main>
        <Hero onBook={() => openBooking()} />
        <About />
        <Rooms onBook={openBooking} onGallery={showGallery} />
        <Contacts />
      </main>
      <footer className="site-footer"><Brand /><span>Отель «Вознесенский» · Петрозаводск</span><a href="tel:+79114638683">+7 911 463 86 83</a></footer>
      {modal === 'booking' && <BookingModal initialRoom={selectedRoom} onClose={closeModal} onSuccess={() => setModal('success')} />}
      {modal === 'success' && <SuccessModal onClose={closeModal} />}
      {modal === 'gallery' && <GalleryModal room={galleryRoom} onClose={closeModal} />}
    </>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<React.StrictMode><App /></React.StrictMode>)

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount())
}
