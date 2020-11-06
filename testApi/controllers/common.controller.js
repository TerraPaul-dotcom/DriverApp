exports.findAll = async (Model, condition, res) => {
        try {
            
            const data = await Model.find(condition)
            res.send(data)
        } catch {
            err => {
            res.status(500).send({
                message:
                    err.message || "Ein Fehler ist beim abrufen passiert."
            })
        }
        }
}

exports.create = async (Model, keyValueObject, res) => {
    if (!keyValueObject) {
        res.status(400).send({ message: "Inhalt kann nicht leer sein."})
        return
    } 
    
    try {
        const model = new Model (keyValueObject)
        const newEntry = await model.save()
        .then (data => {
            res.send(data)
        })
    } catch {
        res.status(500).send({
            message: 
                
            "Ein Fehler ist passiert beim Anlegen des Eintrages."
        })
    }
}

exports.update = async (id, Model, dataToUpdate, res) => {
    Model.findByIdAndUpdate(id, dataToUpdate, {useFindAndModify: false})
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: "Ein Fehler ist beim updaten des Eintrages passiert, Eintrag konnte wahrscheinlich nicht gefunden werden."
            })
            } else res.send({message: "Eintrag erfolgreich angepasst"})
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Ein Fehler ist beim updaten des Eintrages passiert"
        })
    })
}

exports.delete = async (id, Model, res) => {
    Model.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Fehler beim Löschen des Eintrages, eventuell konnte er nicht gefunden werden."
                })
            } else {
                res.send({
                    message: "Eintrag wurde erfolgreich gelöscht"
                })
            }
        })
        .catch (err => {
            res.status(500).send({
                message: "Eintrag konnte nicht gelöscht werden."
            })
        })
}

exports.findById = async (id, Model, res) => {
    try {  
        const data = await Model.findById(id)
        res.send(data)
    } catch {
        err => {
        res.status(500).send({
            message: err.message || "Ein Fehler ist beim abrufen passiert."
        })
    }
    }
}

exports.findNewest = async (Model, condition, res) => {
    try {
        if (!condition) {condition = null}
        const data = await Model.find(condition).limit(1).sort({$natural:-1})
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message || "Ein Fehler ist beim abrufen passiert."
        })
    }
}