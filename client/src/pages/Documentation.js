import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      content: (
        <>
          <h3>Welcome to ifitness</h3>
          <p>This guide will help you get started with ifitness in just a few minutes.</p>
          
          <h4>Creating an Account</h4>
          <ol>
            <li>Visit the registration page</li>
            <li>Enter your name, email, and password</li>
            <li>Provide your age, weight, and height</li>
            <li>Set your fitness goal</li>
            <li>Click "Register" to create your account</li>
          </ol>

          <h4>First Steps</h4>
          <ul>
            <li>Complete your profile with accurate health information</li>
            <li>Log your first workout</li>
            <li>Set some fitness goals</li>
            <li>Explore the analytics dashboard</li>
          </ul>
        </>
      )
    },
    'workouts': {
      title: 'Logging Workouts',
      content: (
        <>
          <h3>How to Log a Workout</h3>
          
          <h4>Manual Workout Entry</h4>
          <ol>
            <li>Go to "New Workout" from the Training menu</li>
            <li>Select the workout type or create a custom workout</li>
            <li>Add exercises with details (sets, reps, weight)</li>
            <li>Enter duration and estimated calories burned</li>
            <li>Add notes if desired</li>
            <li>Click "Save Workout"</li>
          </ol>

          <h4>Using Workout Templates</h4>
          <p>We provide pre-built templates for common workout types. To use them:</p>
          <ol>
            <li>Navigate to "Workout Templates"</li>
            <li>Select a template that matches your routine</li>
            <li>Customize exercises as needed</li>
            <li>Save as a new workout</li>
          </ol>
        </>
      )
    },
    'analytics': {
      title: 'Understanding Analytics',
      content: (
        <>
          <h3>Analytics Dashboard</h3>
          
          <h4>Key Metrics</h4>
          <ul>
            <li><strong>Total Workouts:</strong> Your cumulative workout count</li>
            <li><strong>Total Duration:</strong> Hours spent exercising</li>
            <li><strong>Total Calories Burned:</strong> Estimated calories from all workouts</li>
            <li><strong>Average Intensity:</strong> Your typical workout intensity</li>
          </ul>

          <h4>Charts and Graphs</h4>
          <p>View trends over time with our interactive charts:</p>
          <ul>
            <li>Weekly activity overview</li>
            <li>Monthly progress tracking</li>
            <li>Exercise frequency analysis</li>
            <li>Calories burned trends</li>
          </ul>
        </>
      )
    },
    'goals': {
      title: 'Setting Goals',
      content: (
        <>
          <h3>How to Set Fitness Goals</h3>
          
          <h4>Creating a Goal</h4>
          <ol>
            <li>Navigate to "Health" → "Goals"</li>
            <li>Click "Create New Goal"</li>
            <li>Set a goal type (weight loss, muscle gain, endurance, etc.)</li>
            <li>Define your target and deadline</li>
            <li>Add motivation notes</li>
            <li>Track progress regularly</li>
          </ol>

          <h4>SMART Goals</h4>
          <p>Create effective goals that are:</p>
          <ul>
            <li><strong>Specific:</strong> Clear and well-defined</li>
            <li><strong>Measurable:</strong> Quantifiable progress</li>
            <li><strong>Achievable:</strong> Realistic targets</li>
            <li><strong>Relevant:</strong> Aligned with your fitness</li>
            <li><strong>Time-bound:</strong> Set a deadline</li>
          </ul>
        </>
      )
    },
    'privacy': {
      title: 'Privacy & Security',
      content: (
        <>
          <h3>Your Data is Safe</h3>
          
          <h4>Data Protection</h4>
          <p>We use industry-standard encryption to protect your personal information and workout data.</p>
          
          <h4>Privacy Controls</h4>
          <ul>
            <li>Control who can see your profile</li>
            <li>Manage data sharing preferences</li>
            <li>Download your data anytime</li>
            <li>Request data deletion</li>
          </ul>

          <h4>Learn More</h4>
          <p>For detailed information, please read our <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-of-service">Terms of Service</a>.</p>
        </>
      )
    }
  };

  return (
    <PageTransition>
      <div className="container py-5">
        <div className="row">
        <div className="col-lg-2 mb-4 mb-lg-0">
          <div className="list-group sticky-top" style={{ top: '20px' }}>
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                className={`list-group-item list-group-item-action ${activeSection === key ? 'active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {sections[activeSection].content}
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title">Still need help?</h5>
              <p className="card-text text-muted mb-0">
                Check out our <a href="/help-center">Help Center</a> or <a href="/contact">contact us</a> for more assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
