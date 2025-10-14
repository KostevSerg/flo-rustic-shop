import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">О нас</h1>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              FloRustic — это цветочная мастерская, где каждый букет создается с любовью и вниманием к деталям. 
              Мы верим, что цветы — это не просто подарок, а способ выразить свои чувства и эмоции.
            </p>
            <p>
              Наша команда флористов работает только со свежими цветами от проверенных поставщиков. 
              Мы следим за трендами во флористике и создаем уникальные композиции, которые радуют наших клиентов.
            </p>
            <p>
              С 2020 года мы дарим радость жителям города и гордимся тем, что стали частью ваших важных моментов — 
              от свадеб и юбилеев до простых знаков внимания близким людям.
            </p>
            <div className="bg-accent/30 p-8 rounded-lg mt-12">
              <h2 className="text-3xl font-bold mb-4">Наши ценности</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Свежесть и качество каждого цветка</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Индивидуальный подход к каждому заказу</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Своевременная доставка</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Честные цены без переплат</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
