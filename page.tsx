 "use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Answer = { id: string; name: string; question: string; answer: string; created_at: string };

export default function Home() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);

  async function loadAnswers() {
    const { data } = await supabase.from("questions")
      .select("id,name,question,answer,created_at")
      .eq("is_published", true)
      .not("answer", "is", null)
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setAnswers(data as Answer[]);
  }

  useEffect(() => { loadAnswers(); }, []);

  async function submitQuestion(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice("");
    if (name.trim().length < 2 || question.trim().length < 5) {
      setNotice("Please enter your name and a question of at least 5 characters.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("questions").insert({
      name: name.trim().slice(0, 60),
      question: question.trim().slice(0, 1000)
    });
    setSending(false);
    if (error) setNotice("Couldn't send your question. Please try again in a moment.");
    else {
      setName("");
      setQuestion("");
      setNotice("Your question has been sent. Thanks for asking!");
    }
  }

  return (
    <main className="page-shell">
      <nav className="nav"><a className="brand" href="/">ASK <span>ROMAN.</span></a><a className="nav-link" href="#answers">Answers ↗</a></nav>
      <section className="hero">
        <div className="eyebrow"><span className="pulse" /> A PERSONAL Q&A SPACE</div>
        <h1>A space<br /><em>to ask.</em></h1>
        <p className="intro">Curious about me? Leave a question. I’ll choose some to answer and share them here.</p>
        <form className="question-card" onSubmit={submitQuestion}>
          <div className="card-top"><span>YOUR MESSAGE</span><span className="tiny-mark">01 / ASK</span></div>
          <label htmlFor="name">Your name</label>
          <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="How should I call you?" maxLength={60} required />
          <label htmlFor="question">What's on your mind?</label>
          <textarea id="question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask Roman anything..." maxLength={1000} rows={4} required />
          <div className="form-bottom"><span className="privacy-note">Your name will be visible with your question if it is published.</span><button disabled={sending}>{sending ? "SENDING..." : "SEND QUESTION ↗"}</button></div>
          {notice && <p className="notice" role="status">{notice}</p>}
        </form>
        <div className="scroll-note">SCROLL TO EXPLORE <span>↓</span></div>
      </section>
      <section className="answers-section" id="answers">
        <div className="section-heading"><div><div className="eyebrow">FROM THE INBOX</div><h2>Questions &<br /><em>answers.</em></h2></div><p>Some questions deserve<br />a little space.</p></div>
        {answers.length === 0 ? <div className="empty-state">No answers published yet.<br /><span>Check back soon.</span></div> :
          <div className="answer-grid">{answers.map((item, i) => <article className="answer-card" key={item.id}>
            <div className="answer-meta"><span>Q. {String(i + 1).padStart(2, "0")}</span><span>ASKED BY {item.name.toUpperCase()}</span></div>
            <h3>{item.question}</h3><div className="answer-divider" /><p>{item.answer}</p>
          </article>)}</div>}
      </section>
      <footer><a className="brand" href="/">ASK <span>ROMAN.</span></a><span>MADE FOR CURIOSITY.</span><a href="/admin" className="footer-admin">ADMIN ↗</a></footer>
    </main>
  );
}