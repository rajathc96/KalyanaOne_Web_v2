import './MessageEtiquette.css';

const MessageEtiquette = () => {
  const rules = [
    { emoji: '🤝', text: 'Be polite and respectful in your conversations' },
    { emoji: '🧠', text: 'Think before you type, kindness builds better connections' },
    { emoji: '❌', text: 'Avoid sharing personal or financial details too soon' },
    { emoji: '🚫', text: 'No harassment, hate speech, or inappropriate content' },
    { emoji: '📸', text: 'Be honest about yourself, clear and truthful communication matters' },
    { emoji: '🙅‍♀️', text: 'If someone isn’t interested, respect their decision' },
  ];

  return (
    <div className="etiquette-wrapper">
      <div className="etiquette-title">💬 Message Etiquette</div>

      <div className="etiquette-container">
        {rules.map((rule, index) => (
          <div key={index} className="etiquette-rule-row">
            <span className="etiquette-emoji">{rule.emoji}</span>
            <span className="etiquette-rule-text">{rule.text}</span>
          </div>
        ))}
      </div>

      <div className="etiquette-footer">Let meaningful conversations blossom 🌸</div>
    </div>
  );
};

export default MessageEtiquette;
