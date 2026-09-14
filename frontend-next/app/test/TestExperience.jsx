'use client';

import { useState } from 'react';

const questions = [
  { text: 'When making an important decision, you are more likely to:', choices: ['Think it through privately first', 'Talk it through with someone'] },
  { text: 'When plans suddenly change, you usually:', choices: ['Prefer to restore structure quickly', 'Adapt as the situation develops'] },
  { text: 'In a group conversation, you tend to:', choices: ['Speak after forming your thoughts', 'Discover your thoughts while speaking'] },
  { text: 'When learning something new, you prefer:', choices: ['Clear examples and practical details', 'Concepts, patterns, and possibilities'] },
  { text: 'When making a difficult choice, you usually prioritize:', choices: ['Consistency and logic', 'Personal values and human impact'] },
  { text: 'Your ideal weekend is more likely to be:', choices: ['Planned in advance', 'Open and flexible'] },
  { text: 'When solving a problem, you usually begin with:', choices: ['What has worked before', 'What else might be possible'] },
  { text: 'Deadlines usually make you:', choices: ['Narrow the options and finish', 'Keep improving the idea until late'] },
];

export default function TestExperience() {
  const [showMessage, setShowMessage] = useState(false);

  function submit(event) {
    event.preventDefault();
    setShowMessage(true);
  }

  return (
    <form className="test-form" onSubmit={submit}>
      {questions.map((question, index) => (
        <fieldset className="question" key={question.text}>
          <legend><span>{String(index + 1).padStart(2, '0')}</span>{question.text}</legend>
          <div className="choice-grid">
            {question.choices.map((choice, choiceIndex) => (
              <label className="choice" key={choice}>
                <input type="radio" name={`question-${index + 1}`} value={choiceIndex === 0 ? 'A' : 'B'} required />
                <span className="choice-letter">{choiceIndex === 0 ? 'A' : 'B'}</span>
                <span>{choice}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="test-submit">
        <button className="button" type="submit">See my result <span aria-hidden="true">→</span></button>
        <p className="result-message" aria-live="polite">{showMessage ? 'Your full personality result is coming soon.' : ''}</p>
      </div>
    </form>
  );
}
