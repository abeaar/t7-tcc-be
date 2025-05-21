
import Notes from "../models/NoteModel.js";

// GET
async function getNotes(req, res) {
  try {
    const response = await Notes.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// GET BY ID
async function getNotesbyId(req, res) {
  try {
    const response = await Notes.findOne({ where: { id: req.params.id } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// REGISTER //baru nambahin pasword dan bcrypt
async function createNotes(req, res) {
  try {
    await Notes.create(req.body);
    res.status(200).json({ msg: "Successfully added!" });
  } catch(error) {
    console.log(error);
  }
}

//baru nambahin case password
async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { name, email, title, category } = req.body;

    if(!id) {
      return res.status(400).json({ msg: "Owner or ID is empty!" })
    };

    const existingData = await Notes.findOne({
      where: {
        id: id
      }
    });

    if(!existingData) {
      return res.status(400).json({ msg: "Data not found!" });
    };

    const newData = {
      name: name || existingData.name,
      email: email || existingData.email,
      title: title || existingData.title,
      category: category || existingData.category
    };

    await Notes.update(newData, {
      where: {
        id: id
      }
    });
    res.status(200).json({ msg: "Successfully updated!" });
    console.log(newData);
  } catch(error) {
    res.status(400).json({ msg: "Error update" });
  };
}

async function deleteNote(req, res) {
  try {
    await Notes.destroy({ where: { id: req.params.id } });
    res.status(201).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
}

export { getNotes, getNotesbyId, createNotes, updateNote, deleteNote};