import { Link } from 'react-router-dom';

const outdoorCards = [
  { title: 'MOUNTAINS', copy: 'Challenge yourself.', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88' },
  { title: 'FOREST', copy: 'Find your balance.', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=88' },
  { title: 'OPEN SKY', copy: 'Breathe. Move. Live.', image: 'https://images.unsplash.com/photo-1530538987395-032d1800fdd4?auto=format&fit=crop&w=1200&q=88' },
];

const programCards = [
  { title: 'STRENGTH TRAINING', copy: 'Build your power.', level: 'Intermediate', duration: '45 min', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=88' },
  { title: 'CARDIO', copy: 'Move your body.', level: 'All levels', duration: '30 min', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=88' },
  { title: 'WEIGHT LOSS', copy: 'Build a healthier rhythm.', level: 'Beginner', duration: '40 min', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=88' },
  { title: 'MUSCLE BUILDING', copy: 'Train with intention.', level: 'Advanced', duration: '60 min', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=88' },
  { title: 'FLEXIBILITY', copy: 'Move with freedom.', level: 'All levels', duration: '25 min', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=88' },
  { title: 'YOGA', copy: 'Train your mind.', level: 'Beginner', duration: '35 min', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=88' },
  { title: 'FUNCTIONAL TRAINING', copy: 'Build useful strength.', level: 'Intermediate', duration: '45 min', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1200&q=88' },
  { title: 'BEGINNER WORKOUTS', copy: 'Start with confidence.', level: 'Beginner', duration: '30 min', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=88' },
];

const gymZones = [
  { title: 'WEIGHT TRAINING', copy: 'Dumbbells, barbells and space to build.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=88' },
  { title: 'CARDIO ZONE', copy: 'Treadmills, bikes and room for momentum.', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=88' },
  { title: 'FUNCTIONAL FLOOR', copy: 'Cable machines, racks and open movement.', image: 'https://images.unsplash.com/photo-1584380931214-dbb5b72e7fd0?auto=format&fit=crop&w=1200&q=88' },
  { title: 'STRETCH & RECOVER', copy: 'A calm space to reset and restore.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=88' },
];

const equipmentCards = [
  ['Dumbbells', 'Free-weight strength work.', 'Strength', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=88'],
  ['Barbells', 'Compound lifts and power.', 'Strength', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=88'],
  ['Treadmills', 'Steady-state and interval cardio.', 'Cardio', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=88'],
  ['Exercise Bikes', 'Low-impact conditioning.', 'Cardio', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=88'],
  ['Bench Press', 'Controlled upper-body power.', 'Strength', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=88'],
  ['Squat Rack', 'Lower-body foundations.', 'Functional', 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=88'],
  ['Cable Machine', 'Guided full-body movement.', 'Functional', 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=88'],
  ['Leg Press', 'Focused lower-body training.', 'Strength', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=88'],
  ['Rowing Machine', 'Full-body endurance work.', 'Cardio', 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=88'],
  ['Kettlebells', 'Dynamic strength and power.', 'Functional', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=88'],
  ['Resistance Gear', 'Scalable training support.', 'Mobility', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=88'],
  ['Yoga Equipment', 'Balance and recovery tools.', 'Wellness', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=88'],
];

const goalCards = [
  ['BUILD STRENGTH', 'Lift with confidence.', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=88'],
  ['IMPROVE FITNESS', 'Make movement a habit.', 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=88'],
  ['LOSE WEIGHT', 'Find your sustainable pace.', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=88'],
  ['BUILD ENDURANCE', 'Go further, steadily.', 'https://images.unsplash.com/photo-1530538987395-032d1800fdd4?auto=format&fit=crop&w=900&q=88'],
  ['IMPROVE FLEXIBILITY', 'Move freely every day.', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=88'],
  ['HEALTHY LIFESTYLE', 'Create balance that lasts.', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=900&q=88'],
];

const trainers = [
  ['Maya Chen', 'Strength Coach', '8 years experience', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=88'],
  ['Jordan Brooks', 'Cardio Coach', '6 years experience', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=88'],
  ['Sofia Ellis', 'Yoga Trainer', '10 years experience', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=88'],
  ['Noah Williams', 'Fitness Coach', '7 years experience', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=88'],
];

function Home() {
  return (
    <main className="home-landing">
      <section className="home-landing-hero" id="home">
        <video className="home-hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="https://cdn.dribbble.com/userupload/49105016/file/large-85728cf543dd89f38e5f633d88534909.mp4" type="video/mp4" />
        </video>
        <nav className="home-landing-nav" aria-label="Main navigation">
          <a className="home-landing-logo" href="#home"><span>F</span> FITZONE</a>
          <div className="home-landing-links">
            <a href="#home">Home</a>
            <a href="#discover">Discover</a>
            <a href="#programs">Programs</a>
            <Link to="/plans">Plans</Link>
            <a href="#membership">Membership</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="home-auth-links"><Link className="home-login-link" to="/login">Login <span>↗</span></Link><Link className="home-register-link" to="/register">Register</Link></div>
        </nav>
        <div className="home-hero-copy">
          <p className="home-kicker">Fitness / Wellness / Strength</p>
          <h1>FIND YOUR<br /><em>STRENGTH</em></h1>
          <p>Move. Breathe. Grow.</p>
          <span>Build strength, create healthy habits, and take one step closer to your goals.</span>
          <small className="home-hero-quote">“Your only limit is the one you set yourself.”</small>
          <a className="home-primary-button" href="#discover">START YOUR FITNESS JOURNEY <b>↗</b></a>
          <div className="home-hero-tags" aria-label="Fitness themes"><span>OUTDOOR FITNESS</span><span>WELLNESS</span><span>STRENGTH</span></div>
        </div>
        <div className="home-hero-subject"><img src="https://m.gettywallpapers.com/wp-content/uploads/2022/07/Gym-Exercise-Wallpaper.jpg" alt="Gym equipment in a training space" /></div>
        <div className="home-hero-scroll"><span>Scroll to explore</span><i /></div>
      </section>

      <section className="home-nature-section" id="discover">
        <div className="home-section-intro"><p className="home-kicker">A different kind of strong</p><h2>MORE THAN<br /><em>A WORKOUT</em></h2></div>
        <div className="home-section-copy"><p>Fitness is not only about building the body. It is about creating balance, confidence, energy and a healthier way of living.</p><span>“Move with purpose. Live with energy.”</span></div>
        <div className="home-nature-cards">
          <article><img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=88" alt="Woman practicing mindful meditation outdoors" /><div><span>01</span><h3>MIND</h3><p>Find balance and peace.</p></div></article>
          <article><img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=88" alt="Athlete building strength with weights" /><div><span>02</span><h3>BODY</h3><p>Build strength and energy.</p></div></article>
          <article><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=88" alt="Athlete working toward a fitness goal" /><div><span>03</span><h3>GOALS</h3><p>Turn consistency into progress.</p></div></article>
        </div>
      </section>

      <section className="home-gym-section" id="about">
        <div className="home-section-intro"><p className="home-kicker">Inside Fitzone</p><h2>YOUR COMPLETE<br /><em>FITNESS SPACE</em></h2></div>
        <p className="home-wide-copy">Train with the right equipment, structured programs and a supportive fitness environment.</p>
        <div className="home-zone-grid">{gymZones.map((zone, index) => <figure key={zone.title}><img src={zone.image} alt={`${zone.title.toLowerCase()} gym zone`} /><figcaption><span>0{index + 1}</span><h3>{zone.title}</h3><p>{zone.copy}</p></figcaption></figure>)}</div>
      </section>

      <section className="home-outdoor-section">
        <div className="home-section-intro"><p className="home-kicker">The world is your gym</p><h2>TRAIN WITHOUT<br /><em>LIMITS</em></h2></div>
        <div className="home-outdoor-grid">{outdoorCards.map((card, index) => <figure key={card.title}><img src={card.image} alt={`${card.title.toLowerCase()} outdoor fitness environment`} /><figcaption><span>0{index + 1}</span><h3>{card.title}</h3><p>{card.copy}</p></figcaption></figure>)}</div>
      </section>

      <section className="home-timeline-section" id="membership">
        <div className="home-section-intro"><p className="home-kicker">One step at a time</p><h2>YOUR FITNESS<br /><em>JOURNEY</em></h2></div>
        <div className="home-timeline">
          <article><span>01</span><strong>BEGIN</strong><h3>Start where you are</h3><p>Every fitness journey begins with one decision: to start.</p><a href="#programs">START YOUR JOURNEY <b>↗</b></a></article>
          <article><span>02</span><strong>MOVE</strong><h3>Make momentum</h3><p>Move your body, build your strength, and make every workout count.</p><a href="#programs">EXPLORE WORKOUTS <b>↗</b></a></article>
          <article><span>03</span><strong>GROW</strong><h3>Meet your potential</h3><p>Push your limits, build better habits, and become stronger.</p><a href="#equipment">BUILD YOUR STRENGTH <b>↗</b></a></article>
          <article><span>04</span><strong>ACHIEVE</strong><h3>Own your progress</h3><p>Track your progress, celebrate every milestone, and keep moving forward.</p><Link to="/dashboard">VIEW YOUR PROGRESS <b>↗</b></Link></article>
        </div>
        <blockquote className="home-membership-quote">“A membership opens the door. Your commitment takes you further.”</blockquote>
      </section>

      <section className="home-equipment-section" id="equipment">
        <div className="home-section-intro"><p className="home-kicker">Built to perform</p><h2>GYM<br /><em>EQUIPMENT</em></h2></div>
        <p className="home-wide-copy">Professional tools for every kind of training, from first rep to personal best.</p>
        <div className="home-equipment-grid">{equipmentCards.map(([title, copy, category, image]) => <article key={title}><img src={image} alt={`${title} gym equipment`} /><div><h3>{title}</h3><p>{copy}</p><span>{category}</span></div></article>)}</div>
      </section>

      <section className="home-goals-section">
        <div className="home-section-intro"><p className="home-kicker">Make it personal</p><h2>CHOOSE<br /><em>YOUR GOAL</em></h2></div>
        <div className="home-goals-grid">{goalCards.map(([title, copy, image]) => <article key={title}><img src={image} alt={`${title.toLowerCase()} fitness goal`} /><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </section>

      <section className="home-programs-section" id="programs">
        <div className="home-section-intro"><p className="home-kicker">Structured for progress</p><h2>TRAINING<br /><em>PROGRAMS</em></h2></div>
        <div className="home-program-grid home-program-detail-grid">{programCards.map((card, index) => <article key={card.title}><img src={card.image} alt={`${card.title.toLowerCase()} fitness program`} /><div><span>Program / 0{index + 1} · {card.level}</span><h3>{card.title}</h3><p>{card.copy} · {card.duration}</p><Link to="/plans">Explore plans <b>↗</b></Link></div></article>)}</div>
      </section>

      <section className="home-trainers-section">
        <div className="home-section-intro"><p className="home-kicker">People behind the progress</p><h2>OUR<br /><em>TRAINERS</em></h2></div>
        <div className="home-trainer-grid">{trainers.map(([name, specialty, experience, image]) => <article key={name}><img src={image} alt={`${name}, ${specialty}`} /><div><h3>{name}</h3><p>{specialty}</p><span>{experience}</span></div></article>)}</div>
      </section>

      <section className="home-facilities-section">
        <div className="home-section-intro"><p className="home-kicker">More than a room</p><h2>GYM<br /><em>FACILITIES</em></h2></div>
        <div className="home-facility-grid">
          <article><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=88" alt="Strength training area with free weights and machines" /><div className="home-facility-content"><p className="home-kicker">01 / Strength</p><h3>WEIGHT ZONE</h3><strong>Strength foundations.</strong><p>Build strength with dedicated equipment for every level.</p><span className="home-facility-tags">Free Weights <i>•</i> Dumbbells <i>•</i> Strength Machines</span></div></article>
          <article><img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1000&q=88" alt="Cardio training area with exercise machines" /><div className="home-facility-content"><p className="home-kicker">02 / Endurance</p><h3>CARDIO ZONE</h3><strong>Build your engine.</strong><p>Improve endurance and keep your energy moving.</p><span className="home-facility-tags">Treadmills <i>•</i> Cycling <i>•</i> Cross Trainers</span></div></article>
          <article><img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=88" alt="Calm yoga and stretching space" /><div className="home-facility-content"><p className="home-kicker">03 / Wellness</p><h3>YOGA ZONE</h3><strong>Reset and restore.</strong><p>Find balance through mindful movement, flexibility, and breath.</p><span className="home-facility-tags">Yoga Mats <i>•</i> Stretching <i>•</i> Meditation</span></div></article>
          <article><img src="https://images.unsplash.com/photo-1584380931214-dbb5b72e7fd0?auto=format&fit=crop&w=1000&q=88" alt="Functional training zone with gym equipment" /><div className="home-facility-content"><p className="home-kicker">04 / Movement</p><h3>FUNCTIONAL FLOOR</h3><strong>Move with purpose.</strong><p>Train naturally with dynamic exercises that build strength and mobility.</p><span className="home-facility-tags">Kettlebells <i>•</i> Battle Ropes <i>•</i> Functional Training</span></div></article>
        </div>
      </section>

      <section className="home-quote-section"><p>“Your body can achieve more than your mind believes.”</p></section>

      <section className="home-final-section" id="contact">
        <div><p className="home-kicker">The next step is yours</p><h2>YOUR JOURNEY<br /><em>STARTS HERE</em></h2><p>Stronger body. Calmer mind. Healthier life.</p><Link className="home-primary-button" to="/plans">EXPLORE PLANS <b>↗</b></Link><div className="home-signup-cta"><h3>READY TO START YOUR FITNESS JOURNEY?</h3><div><Link to="/register">REGISTER NOW <b>↗</b></Link><Link to="/login">LOGIN <b>↗</b></Link></div></div></div>
      </section>
      <footer className="home-landing-footer"><a className="home-landing-logo" href="#home"><span>F</span> FITZONE</a><p>Strong body. Calm mind. Healthy life.</p><small>© 2026 Fitzone</small></footer>
    </main>
  );
}

export default Home;
