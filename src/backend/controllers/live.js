import liveRepository from "../repositories/live";

async function getAll() {
    return await liveRepository.getAll();
}

async function update(body) {
    const { id, status } = body;
    const result = await liveRepository.update(id, status);
    if (result.affectedRows == 1) {
        const all = await liveRepository.getAll();
        return all;
    }
}

const liveController = {
    getAll,
    update,
};

export default liveController;
