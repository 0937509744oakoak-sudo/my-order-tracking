'use client';

import { FormEvent, useState } from 'react';

type Status = 'queue' | 'progress' | 'completed' | 'payment';
type Order = { id: string; date: string; status: Status; count: number; total: number; past: boolean };

const orders: Order[] = [
  { id: 'ORD-2587965432159-458', date: '21/08/2026 15:42 น.', status: 'progress', count: 3, total: 1490, past: false },
  { id: 'ORD-1122334455667-101', date: '20/08/2026 10:15 น.', status: 'payment', count: 1, total: 590, past: false },
  { id: 'ORD-4455667788990-303', date: '19/08/2026 09:00 น.', status: 'queue', count: 2, total: 890, past: false },
  { id: 'ORD-9988776655443-202', date: '15/08/2026 18:30 น.', status: 'completed', count: 5, total: 3200, past: true },
  { id: 'ORD-6677889900112-701', date: '10/08/2026 11:20 น.', status: 'completed', count: 2, total: 1280, past: true },
];
const labels: Record<Status, string> = { queue: 'อยู่ในคิว', progress: 'กำลังดำเนินการ', completed: 'เสร็จสิ้น', payment: 'รอชำระเงิน' };

function Badge({ status }: { status: Status }) {
  return <span className={`badge badge-${status}`}><i aria-hidden="true" />{labels[status]}</span>;
}

export default function OrderTrackingPage() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'current' | 'past'>('current');
  const [result, setResult] = useState<Order | null>(null);
  const [copied, setCopied] = useState('');

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    setResult(null);
    if (!/^ORD-\d{13}-\d{3}$/.test(value)) {
      setError(value ? 'รูปแบบหมายเลขไม่ถูกต้อง ลองตรวจสอบแล้วค้นหาอีกครั้ง' : 'กรุณากรอกหมายเลขออเดอร์');
      return;
    }
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      const found = orders.find((order) => order.id === value);
      setResult(found ?? null);
      setError(found ? '' : 'ไม่พบออเดอร์นี้ ลองตรวจสอบหมายเลขอีกครั้ง');
      setLoading(false);
    }, 500);
  }

  async function copy(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(id);
      window.setTimeout(() => setCopied(''), 1600);
    } catch {
      setError('ไม่สามารถคัดลอกได้ กรุณาคัดลอกหมายเลขด้วยตนเอง');
    }
  }

  const shown = orders.filter((order) => (tab === 'past' ? order.past : !order.past));
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="#top" aria-label="Trackly หน้าหลัก"><span className="brand-mark">t.</span><span>trackly<span className="brand-dot">.</span></span></a><span className="topbar-note"><span className="online-dot" /> ศูนย์ช่วยเหลือ <span className="topbar-divider">·</span> 02-123-4567</span></header>
      <div className="content" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> ORDER CARE <span className="eyebrow-line" /></div>
        <header className="hero"><h1>ทุกออเดอร์<br className="mobile-break" /> อยู่ในสายตาคุณ<span className="hero-period">.</span></h1><p>ติดตามสถานะคำสั่งซื้อของคุณได้ง่าย ๆ ในที่เดียว</p></header>
        <section className="search-card" aria-labelledby="search-title">
          <div className="section-kicker"><span>01</span><span className="kicker-line" /> TRACK YOUR ORDER</div>
          <h2 id="search-title">เริ่มจากหมายเลขออเดอร์</h2><p className="search-copy">กรอกหมายเลขที่ได้รับทางอีเมล เพื่อดูความคืบหน้าล่าสุด</p>
          <form onSubmit={search} noValidate>
            <label htmlFor="order-id">หมายเลขออเดอร์ <span>*</span></label>
            <div className={`input-row ${error ? 'has-error' : ''}`}>
              <div className="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16v12H4zM8 7.5V5h8v2.5M8 12h8m-8 4h5" /></svg><input id="order-id" value={query} onChange={(e) => { setQuery(e.target.value); setError(''); }} placeholder="ORD-2587965432159-458" autoComplete="off" aria-invalid={Boolean(error)} aria-describedby="order-help" /></div>
              <button className="search-button" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> กำลังค้นหา</> : <>ค้นหา <span aria-hidden="true">↗</span></>}</button>
            </div>
            <p id="order-help" className={error ? 'form-note error-note' : 'form-note'} role={error ? 'alert' : undefined}>{error || <>รูปแบบ: <code>ORD-</code> ตามด้วยตัวเลข เช่น <code>ORD-2587965432159-458</code></>}</p>
          </form>
          {result && <div className="result-card" role="status"><div><span className="result-label">พบออเดอร์ของคุณ</span><strong>{result.id}</strong><small>ทำรายการเมื่อ {result.date}</small></div><Badge status={result.status} /></div>}
        </section>
        <section className="orders-section" aria-labelledby="orders-title">
          <div className="list-heading"><div><div className="section-kicker"><span>02</span><span className="kicker-line" /> ORDER HISTORY</div><h2 id="orders-title">รายการของคุณ</h2></div><span className="secure-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10V7a6 6 0 0 1 12 0v3m-13 0h14v11H5z" /></svg> ข้อมูลส่วนตัวของคุณปลอดภัย</span></div>
          <nav className="tabs" aria-label="กรองรายการออเดอร์"><button type="button" role="tab" aria-selected={tab === 'current'} className={tab === 'current' ? 'active' : ''} onClick={() => setTab('current')}>ออเดอร์ปัจจุบัน <span>{orders.filter((o) => !o.past).length}</span></button><button type="button" role="tab" aria-selected={tab === 'past'} className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>ออเดอร์ที่ผ่านมา</button></nav>
          <div className="order-list">{shown.length ? <ul>{shown.map((order, index) => <li className="order-item" key={order.id}><div className="order-index">{String(index + 1).padStart(2, '0')}</div><div className="order-main"><div className="order-id-row"><h3>{order.id}</h3><button className="copy-button" onClick={() => copy(order.id)} aria-label={`คัดลอก ${order.id}`} title="คัดลอกหมายเลข">{copied === order.id ? '✓ คัดลอกแล้ว' : <><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg><span>คัดลอก</span></>}</button></div><p>ทำรายการเมื่อ <time>{order.date}</time></p></div><div className="order-meta"><span className="order-total">฿{order.total.toLocaleString('th-TH')}</span><span>{order.count} รายการ</span></div><Badge status={order.status} /><span className="order-arrow" aria-hidden="true">↗</span></li>)}</ul> : <div className="empty-state"><span>✳</span><h3>ยังไม่มีออเดอร์ในหมวดนี้</h3><p>รายการใหม่ของคุณจะแสดงที่นี่</p></div>}</div>
        </section>
        <footer className="page-footer"><span>TRACKLY <span className="brand-dot">.</span> ORDER CARE</span><span>ต้องการความช่วยเหลือ? <a href="mailto:hello@trackly.example">ติดต่อเรา ↗</a></span></footer>
      </div>
    </main>
  );
}
