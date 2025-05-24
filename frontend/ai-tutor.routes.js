const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const AiTutorSession = require('../models/ai-tutor-session.model');
const { v4: uuidv4 } = require('uuid');

// Create a new AI tutor session
router.post('/sessions', auth, async (req, res) => {
  try {
    const { language, subject_id, class_id } = req.body;
    
    // Create a new session
    const session = new AiTutorSession({
      user_id: req.user._id,
      session_id: uuidv4(),
      language: language || req.user.preferred_language || 'english',
      subject_id,
      class_id,
      messages: [
        {
          role: 'system',
          content: `You are an educational AI tutor for ${subject_id ? 'a specific subject' : 'various subjects'} designed to help students learn. Communicate in ${language || req.user.preferred_language || 'english'}.`,
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: `Hello! I'm your EduSaarthi AI tutor. How can I help you learn today?`,
          timestamp: new Date()
        }
      ]
    });
    
    await session.save();
    
    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating AI tutor session:', error);
    res.status(500).json({ message: 'Server error while creating AI tutor session' });
  }
});

// Get user's AI tutor sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await AiTutorSession.find({ 
      user_id: req.user._id,
      is_active: true
    })
    .sort({ last_interaction_at: -1 })
    .populate('subject_id', 'name icon_url color_code')
    .populate('class_id', 'name grade_number');
    
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching AI tutor sessions:', error);
    res.status(500).json({ message: 'Server error while fetching AI tutor sessions' });
  }
});

// Get a specific AI tutor session
router.get('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const session = await AiTutorSession.findOne({ 
      session_id: req.params.sessionId,
      user_id: req.user._id
    })
    .populate('subject_id', 'name icon_url color_code')
    .populate('class_id', 'name grade_number');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ session });
  } catch (error) {
    console.error('Error fetching AI tutor session:', error);
    res.status(500).json({ message: 'Server error while fetching AI tutor session' });
  }
});

// Send a message to AI tutor
router.post('/sessions/:sessionId/messages', auth, async (req, res) => {
  try {
    const { message, content_type } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Find the session
    const session = await AiTutorSession.findOne({ 
      session_id: req.params.sessionId,
      user_id: req.user._id,
      is_active: true
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found or inactive' });
    }
    
    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
      content_type: content_type || 'text'
    });
    
    // Update last interaction time
    session.last_interaction_at = new Date();
    
    // For MVP, we'll use a simple rule-based AI response
    // In production, this would call a real AI model API
    
    // Generate AI response based on user message
    let aiResponse = '';
    
    // Simple keyword-based responses for MVP
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage === 'hi') {
      aiResponse = `Hello! How can I help you with your studies today?`;
    } 
    else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      aiResponse = `I'm your EduSaarthi AI tutor, designed to help you learn and understand concepts in various subjects. I can explain topics, solve problems, and answer your questions.`;
    }
    else if (lowerMessage.includes('thank')) {
      aiResponse = `You're welcome! Feel free to ask if you have more questions.`;
    }
    else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      aiResponse = `Goodbye! Come back anytime you need help with your studies.`;
    }
    // Subject-specific responses
    else if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
      aiResponse = `Mathematics is a fascinating subject! I can help with topics like algebra, geometry, calculus, and more. What specific concept would you like to learn about?`;
    }
    else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
      aiResponse = `Science helps us understand the world around us. Whether it's physics, chemistry, or biology, I'm here to help explain scientific concepts. What would you like to know more about?`;
    }
    else if (lowerMessage.includes('english') || lowerMessage.includes('grammar') || lowerMessage.includes('literature')) {
      aiResponse = `English language and literature are important for communication and expression. I can help with grammar, vocabulary, writing, or understanding literary works. What aspect would you like to explore?`;
    }
    // Educational concept explanations
    else if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does')) {
      aiResponse = `That's a great question! To explain this concept properly, I'd need to understand your current knowledge level. Could you tell me what you already know about this topic, and I'll build from there?`;
    }
    else if (lowerMessage.includes('solve') || lowerMessage.includes('problem') || lowerMessage.includes('question')) {
      aiResponse = `I'd be happy to help solve this problem. Let's break it down step by step. First, let's identify what we know and what we need to find. Then we can apply the relevant concepts to reach a solution.`;
    }
    else if (lowerMessage.includes('remember') || lowerMessage.includes('memorize') || lowerMessage.includes('forget')) {
      aiResponse = `Memory techniques can be very helpful for studying! Try connecting new information to things you already know, using visual associations, or teaching the concept to someone else. Spaced repetition is also effective - review material at increasing intervals over time.`;
    }
    else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('understand')) {
      aiResponse = `Effective studying involves active engagement with the material. Try these approaches: 1) Break topics into smaller chunks, 2) Practice with real problems, 3) Explain concepts in your own words, 4) Connect new information to existing knowledge, and 5) Take short breaks to maintain focus.`;
    }
    else {
      aiResponse = `That's an interesting point! To give you the best help, could you provide a bit more context or specify what subject area this relates to? I want to make sure I address your question properly.`;
    }
    
    // Add AI response to session
    session.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      content_type: 'text'
    });
    
    await session.save();
    
    res.json({ 
      message: {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        content_type: 'text'
      }
    });
  } catch (error) {
    console.error('Error sending message to AI tutor:', error);
    res.status(500).json({ message: 'Server error while sending message to AI tutor' });
  }
});

// End an AI tutor session
router.put('/sessions/:sessionId/end', auth, async (req, res) => {
  try {
    const session = await AiTutorSession.findOne({ 
      session_id: req.params.sessionId,
      user_id: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.is_active = false;
    await session.save();
    
    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    console.error('Error ending AI tutor session:', error);
    res.status(500).json({ message: 'Server error while ending AI tutor session' });
  }
});

// Get AI tutor summary of a topic
router.post('/summarize', auth, async (req, res) => {
  try {
    const { topic, complexity_level, language } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    
    // For MVP, we'll use a template-based summary
    // In production, this would call a real AI model API
    
    const selectedLanguage = language || req.user.preferred_language || 'english';
    const selectedLevel = complexity_level || 'beginner';
    
    // Simple topic-based summaries for MVP
    let summary = '';
    const lowerTopic = topic.toLowerCase();
    
    if (selectedLanguage === 'english') {
      if (lowerTopic.includes('photosynthesis')) {
        if (selectedLevel === 'beginner') {
          summary = `Photosynthesis is how plants make their own food. They use sunlight, water, and carbon dioxide to create glucose (sugar) and oxygen. The sunlight is captured by a green substance called chlorophyll, which gives plants their green color. This process happens mainly in the leaves. Plants use the glucose for energy and growth, and release oxygen into the air, which animals and humans breathe.`;
        } else if (selectedLevel === 'intermediate') {
          summary = `Photosynthesis is the biological process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts, particularly in the chlorophyll-containing tissues. The overall reaction can be summarized as: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process consists of two main stages: the light-dependent reactions, which capture energy from sunlight to create ATP and NADPH, and the Calvin cycle (light-independent reactions), which uses this energy to create glucose from carbon dioxide.`;
        } else { // advanced
          summary = `Photosynthesis is a complex biochemical process that converts light energy into chemical energy, sustaining most of Earth's ecosystems. It occurs in the thylakoid membranes of chloroplasts in plants and algae, and in the cell membranes of certain bacteria. The process comprises two interconnected stages: the light-dependent reactions (photochemical phase) and the Calvin-Benson cycle (biosynthetic phase). In the light-dependent reactions, photosystems I and II capture photons, exciting electrons that travel through an electron transport chain, generating ATP via chemiosmosis and producing NADPH. The Calvin cycle then utilizes this ATP and NADPH to fix atmospheric carbon dioxide into organic compounds, primarily glyceraldehyde-3-phosphate (G3P), which is subsequently converted to glucose and other carbohydrates. This process is regulated by numerous enzymes, including RuBisCO, which catalyzes the initial carbon fixation reaction but also participates in photorespiration, a competing process that reduces photosynthetic efficiency.`;
        }
      } else if (lowerTopic.includes('gravity') || lowerTopic.includes('newton')) {
        if (selectedLevel === 'beginner') {
          summary = `Gravity is the force that pulls objects toward each other. On Earth, gravity pulls everything toward the center of the planet. This is why things fall down when you drop them. Sir Isaac Newton discovered that all objects with mass have gravity, and the more mass something has, the stronger its gravitational pull. The Earth's gravity keeps us on the ground and makes the moon orbit around us.`;
        } else if (selectedLevel === 'intermediate') {
          summary = `Gravity is one of the four fundamental forces of nature, described by Newton's Law of Universal Gravitation. This law states that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them (F = G * m₁m₂/r²). On Earth, objects accelerate toward the ground at approximately 9.8 m/s² when falling. Gravity is responsible for keeping planets in orbit around the Sun, forming galaxies, and influencing the large-scale structure of the universe.`;
        } else { // advanced
          summary = `Gravity, one of the four fundamental interactions in nature, is comprehensively described by Einstein's General Theory of Relativity as the geometric curvature of spacetime caused by mass and energy. This theory superseded Newton's Law of Universal Gravitation by explaining gravitational phenomena as the movement of objects along geodesics in curved spacetime rather than as a force acting at a distance. The field equations, Gμν = 8πG/c⁴ Tμν, relate the Einstein tensor (representing spacetime curvature) to the stress-energy tensor (representing mass-energy distribution). General Relativity has been experimentally verified through observations of gravitational lensing, gravitational waves, and the precession of Mercury's orbit. At quantum scales, reconciling gravity with quantum mechanics remains one of physics' greatest challenges, leading to theoretical frameworks like string theory and loop quantum gravity that attempt to formulate a consistent theory of quantum gravity.`;
        }
      }
      // Add more topics as needed
      else {
        summary = `I'd be happy to provide a summary of "${topic}" at a ${selectedLevel} level. In a full implementation, this would generate a comprehensive explanation tailored to your needs. For now, this is a placeholder for the AI-generated summary that would be created in the production version.`;
      }
    } else { // Hindi
      if (lowerTopic.includes('photosynthesis')) {
        if (selectedLevel === 'beginner') {
          summary = `प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा पौधे अपना भोजन बनाते हैं। वे सूरज की रोशनी, पानी और कार्बन डाइऑक्साइड का उपयोग करके ग्लूकोज (शर्करा) और ऑक्सीजन बनाते हैं। सूरज की रोशनी को क्लोरोफिल नामक हरे पदार्थ द्वारा पकड़ा जाता है, जो पौधों को उनका हरा रंग देता है। यह प्रक्रिया मुख्य रूप से पत्तियों में होती है। पौधे ग्लूकोज का उपयोग ऊर्जा और विकास के लिए करते हैं, और ऑक्सीजन को हवा में छोड़ते हैं, जिसे जानवर और मनुष्य सांस लेते हैं।`;
        } else {
          summary = `प्रकाश संश्लेषण एक जैविक प्रक्रिया है जिसके द्वारा पौधे प्रकाश ऊर्जा को रासायनिक ऊर्जा में परिवर्तित करते हैं। यह प्रक्रिया क्लोरोप्लास्ट में होती है, विशेष रूप से क्लोरोफिल युक्त ऊतकों में। समग्र प्रतिक्रिया को इस प्रकार संक्षेपित किया जा सकता है: 6CO₂ + 6H₂O + प्रकाश ऊर्जा → C₆H₁₂O₆ + 6O₂। इस प्रक्रिया में दो मुख्य चरण होते हैं: प्रकाश-निर्भर प्रतिक्रियाएँ, जो ATP और NADPH बनाने के लिए सूर्य के प्रकाश से ऊर्जा प्राप्त करती हैं, और कैल्विन चक्र (प्रकाश-स्वतंत्र प्रतिक्रियाएँ), जो कार्बन डाइऑक्साइड से ग्लूकोज बनाने के लिए इस ऊर्जा का उपयोग करता है।`;
        }
      } else {
        summary = `मैं "${topic}" का ${selectedLevel} स्तर पर सारांश प्रदान करने में प्रसन्न होऊंगा। पूर्ण कार्यान्वयन में, यह आपकी आवश्यकताओं के अनुरूप एक व्यापक स्पष्टीकरण उत्पन्न करेगा। अभी के लिए, यह उत्पादन संस्करण में बनाए जाने वाले AI-जनित सारांश के लिए एक प्लेसहोल्डर है।`;
      }
    }
    
    res.json({ 
      summary,
      topic,
      complexity_level: selectedLevel,
      language: selectedLanguage
    });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    res.status(500).json({ message: 'Server error while generating AI summary' });
  }
});

module.exports = router;
