const {questionSchema} = require('../../config.js');

const questionsController = {}

questionsController.postquestion = async (req, res) => {
    try {
        const questions = {
          question: req.body.quest,
          option1: req.body.option1,
          option2: req.body.option2,
          option3: req.body.option3,
          option4: req.body.option4,
          answer: req.body.answer,
          category: req.body.category
        };
    
        const newQ10 = new questionSchema(questions);
        await newQ10.save();
        res.send("Question added successfully");
      } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).send("Error in adding question: " + error.message);
      }
}



questionsController.getquestion = async (req, res) => {
    const questions = await questionSchema.find();
    res.send(questions);
}
module.exports = questionsController;