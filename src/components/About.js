import React from "react";
import '../About.css';
import aboutIcon from '../assets/about1.jpeg'; 

const About = () => {
  return (
    <div className="about-container">
      <div className="header-1">
      <h1>Mom's Vital Vibes</h1>
      </div>
      <div className="about-text-top">
        <p>
        My name is Fatima Rezaie, and I'm blessed with two amazing children, Yama and Helen, who I love deeply. 
        Their love gives me the inspiration and strength I need every day, turning even the hardest days into something beautiful.
        </p>
      </div>
      <div className="about-middle-section">
        <div className="about-text-side">
          <img src={aboutIcon} alt="about1 icon" className="about1-icon" />
          <p>
          I don’t live far; in fact, I feel close to each and every one of you. One of my lifelong wishes has always been to make positive 
          changes in my life, so I can help bring positivity into the lives of others. From my teenage years until today, writing has been 
          my passion. However, life has taken me on a journey that kept me from pursuing it fully.
          I’ve faced challenges that not everyone experiences—having a child at a young age in a new country, without the support of a husband 
          or family, battling depression and loneliness, and dealing with many other obstacles that, in hindsight, don’t make much sense anymore.
          Some say blogging is dead, that no one reads blogs anymore. But I believe people do read; they just need the right content. 
          So here I am, a mother of two, ready to share my life experiences, my journey of moving between two countries, 
          fabulous stories for kids’ bedtime, family friendly cooking ideas and what it means to build a life in a new place.
          </p>
          <p>
          In this blog, I’ll also be sharing the things I do to support my children’s brain and motor development. 
          As a mom, helping Yama and Helen grow into healthy, happy individuals is my top priority, and I’m excited to share the strategies, 
          activities, and insights that have worked for us.
          Whether you’re here to read about the ups and downs of motherhood, the challenges of relocating to new countries, cooking ideas 
          or tips on nurturing your children’s development, I hope you’ll find something meaningful in my words. 
          Let’s enjoy this journey together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
