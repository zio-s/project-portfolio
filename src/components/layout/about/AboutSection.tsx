import React from 'react';
import Link from 'next/link';
import { SectionData } from '@/types/about';

interface AboutSectionProps {
  data: SectionData;
  closeOverlay?: () => void;
}
const AboutSection = ({ data, closeOverlay }: AboutSectionProps) => {
  const renderSectionContent = () => {
    switch (data.type) {
      case 'intro':
        return (
          <div className='text-center'>
            <h1 className='text-6xl font-bold mb-8 font-editorial'>{data.title}</h1>
            <p className='text-xl max-w-2xl mx-auto'>{data.content?.description}</p>
          </div>
        );

      case 'skills':
        return (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {data.content?.skills?.map((skill, index) => (
              <div
                key={index}
                className='service-item text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300'
              >
                <h3 className='text-2xl font-bold mb-4 text-[#263c4f]'>{skill.title}</h3>
                <ul className='space-y-2 text-lg'>
                  {skill.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            {data.content?.education?.map((edu, index) => (
              <div key={index} className='p-6 rounded-lg'>
                <h3 className='text-2xl font-bold mb-4'>{edu.title}</h3>
                {edu.subtitle && <p className='text-lg mb-4'>{edu.subtitle}</p>}
                <ul className='space-y-2 text-lg'>
                  {edu.items.map((item, i) => (
                    <li key={i} className='flex items-start'>
                      <span className='mr-2'>•</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'values':
        return (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {data.content?.values?.map((value, index) => (
              <div key={index} className='text-center p-6'>
                <div className='text-4xl mb-4'>{value.emoji}</div>
                <h3 className='text-2xl font-bold mb-4 text-[#263c4f]'>{value.title}</h3>
                <p className='text-lg'>{value.description}</p>
              </div>
            ))}
          </div>
        );

      case 'contact':
        return (
          <div className='text-center'>
            <p className='text-xl mb-8 max-w-2xl mx-auto'>
              새로운 기회와 도전을 기다리고 있습니다. 함께 일하고 싶으시다면 연락주세요!
            </p>
            <div className='flex gap-4 justify-center'>
              <Link
                href='mailto:popqr1@gmail.com'
                className='inline-block bg-[#263c4f] text-[#fff0db] px-8 py-4 rounded-full text-lg 
                transition-transform hover:scale-105 duration-300'
              >
                Contact Me
              </Link>
              {closeOverlay && (
                <button
                  onClick={closeOverlay}
                  className='inline-block border-2 border-[#263c4f] text-[#263c4f] px-8 py-4 rounded-full text-lg 
                  transition-transform hover:scale-105 duration-300'
                >
                  Back Home
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      className={`min-h-screen flex items-center justify-center px-4 ${data.type !== 'intro' ? 'py-32' : ''}`}
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
      }}
    >
      <div className='max-w-6xl mx-auto w-full'>
        {data.type !== 'intro' && <h2 className='text-4xl font-editorial mb-16 text-center'>{data.title}</h2>}
        {renderSectionContent()}
      </div>
    </section>
  );
};

export default AboutSection;
