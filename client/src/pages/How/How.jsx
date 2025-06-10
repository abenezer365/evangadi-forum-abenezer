import React from 'react';
import css from './How.module.css';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import detailQuestionPage from '../../assets/Question Detail and answer page.jpg'
import homePage from '../../assets/Home page.jpg'
import landingPage from '../../assets/landingPage.jpg'
import signupPage from '../../assets/signUpPage.jpg'
import { Link } from 'react-router-dom';
// Team data with placeholder links (replace with actual links)
const teamMembers = [
  { id: 1, firstName: 'Amanuel', lastName: 'Wubneh', role: 'Developer', github: '#', portfolio: '#' },
  { id: 2, firstName: 'Abenezer', lastName: 'Zewge', role: 'Developer', github: '#', portfolio: '#' },
  { id: 3, firstName: 'Helen', lastName: 'Zelalem', role: 'Developer', github: '#', portfolio: '#' },
  { id: 4, firstName: 'Heran', lastName: 'Yimer', role: 'Developer', github: '#', portfolio: '#' },
  { id: 5, firstName: 'Bereket', lastName: 'Abate', role: 'Developer', github: '#', portfolio: '#' },
  { id: 6, firstName: 'Getasew', lastName: 'Kiflea', role: 'Developer', github: '#', portfolio: '#' },
  { id: 7, firstName: 'Sara', lastName: 'Hailu', role: 'Developer', github: '#', portfolio: '#' },
  { id: 8, firstName: 'Bewket', lastName: 'Wondim', role: 'Developer', github: '#', portfolio: '#' },
  { id: 9, firstName: 'Amanuel', lastName: 'Olkaba', role: 'Developer', github: '#', portfolio: '#' },
  { id: 10, firstName: 'Nardos', lastName: 'Weldhana', role: 'Developer', github: '#', portfolio: '#' },
  { id: 11, firstName: 'Abraham', lastName: 'Gebremichael', role: 'Developer', github: '#', portfolio: '#' },
  { id: 12, firstName: 'Nardos', lastName: 'Gidey', role: 'Developer', github: '#', portfolio: '#' },
  { id: 13, firstName: 'Berhanu', lastName: 'Chondro', role: 'Developer', github: '#', portfolio: '#' },
  { id: 14, firstName: 'Kidist', lastName: 'Solomon', role: 'Developer', github: '#', portfolio: '#' }
];

const How = () => {
  return (
    <div className={css.howContainer}>
      {/* Section 1: Getting Started */}
      <section className={css.section}>
        <div className={css.contentWrapper}>
          <h2 className={css.sectionTitle}>How Evangadi Forum Works</h2>
          <p className={css.introText}>
            Join our community to share knowledge, ask questions, and connect with mentors and peers.
          </p>
          
          <div className={css.stepsContainer}>
            <div className={css.stepCard}>
              <div className={css.stepNumber}>1</div>
              
              <h3 className={css.stepTitle}>Create Your Account</h3>
              <p className={css.stepDescription}>
                Sign up with your email, name, and password. Verification ensures a safe community.
              </p>
              <Link to={'/auth'}>
                 <button className={css.actionButton}>Sign Up Now</button>
              </Link>
            </div>
            
            <div className={css.stepCard}>
              <div className={css.stepNumber}>2</div>
              <h3 className={css.stepTitle}>Post & Browse Questions</h3>
              <p className={css.stepDescription}>
                Ask questions with clear titles and details. Browse existing questions by category.
              </p>
                 <Link to={'/'}>
                   <button className={css.ghostButton}>Browse Questions</button>
                </Link>
            </div>

            <div className={css.stepCard}>
              <div className={css.stepNumber}>3</div>
              <h3 className={css.stepTitle}>Engage with Answers</h3>
              <p className={css.stepDescription}>
                Provide helpful answers, upvote useful responses, and mark solutions as accepted.
              </p>
                  <button  onClick={() => {
                    const element = document.getElementById('sample');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }}} 
                  className={css.ghostButton}>View Example</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Screenshots */}
      <section  id='sample' className={`${css.section} ${css.screenshotSection}`}>
        <div className={css.contentWrapper}>
          <h2 className={css.sectionTitle}>Platform Walkthrough</h2>
          <p className={css.introText}>
            See how community members interact with the platform
          </p>
          
          <div className={css.screenshotGallery}>
            {/* Replace these divs with your actual screenshot images */}
            <div className={css.screenshotItem}>
              <div className={css.screenshotPlaceholder}><img src={landingPage} alt="Landing Page" /></div>
              <p>Landing Page</p>
            </div>
            <div className={css.screenshotItem}>
              <div className={css.screenshotPlaceholder}><img src={signupPage} alt="Signup Page" /></div>
              <p>Sign Up Page</p>
            </div>
            <div className={css.screenshotItem}>
              <div className={css.screenshotPlaceholder}><img src={homePage} alt="Home page" /></div>
              <p>Posting and viewing questions</p>
            </div>
            <div className={css.screenshotItem}>
              <div className={css.screenshotPlaceholder}><img src={detailQuestionPage} alt="Detail question Page" /></div>
              <p>Providing and reviewing answers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Team */}
      <section className={`${css.section} ${css.teamSection}`}>
        <div className={css.contentWrapper}>
          <h2 className={css.sectionTitle}>Meet Our Team</h2>
          <p className={css.introText}>
            The talented developers who built Evangadi Forum
          </p>
          
          <div className={css.teamGrid}>
            {teamMembers.map(member => (
              <div key={member.id} className={css.teamCard}>
                <div className={css.teamImage}>
                  {/* Placeholder for team member image */}
                  <div className={css.avatarPlaceholder}>
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </div>
                </div>
                <h3 className={css.teamName}>{member.firstName} {member.lastName}</h3>
                <p className={css.teamRole}>{member.role}</p>
                <div className={css.teamLinks}>
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub className={css.icon} />
                  </a>
                  <a href={member.portfolio} target="_blank" rel="noopener noreferrer">
                    <FaGlobe className={css.icon} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default How;