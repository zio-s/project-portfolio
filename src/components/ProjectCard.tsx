import Image from 'next/image';

export default function ProjectCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className='project-card p-4 bg-white text-black rounded-lg'>
      <Image
        src={image}
        alt={title}
        className='rounded-md mb-4'
        width={600}
        height={400}
        layout='responsive' // 반응형 이미지
      />
      <h2 className='text-2xl font-bold'>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
