const galleryItems = [
  {
    title: 'Built under pressure',
    category: 'Strength training',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=88',
    className: 'gallery-item-tall',
  },
  {
    title: 'Find your rhythm',
    category: 'Cardio',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1100&q=88',
    className: 'gallery-item-standard',
  },
  {
    title: 'The details matter',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1100&q=88',
    className: 'gallery-item-standard',
  },
  {
    title: 'Guidance that moves you',
    category: 'Personal training',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=88',
    className: 'gallery-item-wide',
  },
  {
    title: 'Your new training ground',
    category: 'Gym interiors',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=88',
    className: 'gallery-item-standard',
  },
  {
    title: 'Better together',
    category: 'Fitness lifestyle',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=88',
    className: 'gallery-item-tall',
  },
];

function Gallery() {
  return (
    <main className="gallery-page">
      <section className="gallery-heading">
        <div>
          <p className="eyebrow">Forge Gym / in motion</p>
          <h1>THE WORK<br /><em>LOOKS GOOD.</em></h1>
          <p>Strength, focus, and the spaces that make progress feel possible.</p>
        </div>
        <span className="gallery-heading-index">06 / 06</span>
      </section>
      <section className="gallery-grid" aria-label="Fitness photography">
        {galleryItems.map((item, index) => (
          <figure className={`gallery-item ${item.className}`} key={item.image}>
            <img src={item.image} alt={item.title} loading={index > 1 ? 'lazy' : 'eager'} />
            <figcaption><span>0{index + 1} / {item.category}</span><strong>{item.title}</strong></figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}

export default Gallery;
