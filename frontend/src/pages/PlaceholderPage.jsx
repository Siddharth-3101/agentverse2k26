import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function PlaceholderPage() {
  const title = useLocation().pathname.split('/').pop().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <section className="placeholder">
      <Construction size={38} />
      <span className="eyebrow">CAMPUS PLATFORM</span>
      <h1>{title}</h1>
      <p>This module is ready for the next phase. Your dashboard is available now.</p>
      <Link className="button primary" to="/dashboard">
        <ArrowLeft size={17} /> Back to dashboard
      </Link>
    </section>
  );
}

