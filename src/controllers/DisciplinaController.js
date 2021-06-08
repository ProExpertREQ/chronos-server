import Curso from '../models/Course';
import Disciplina from '../models/Disciplina';

class DisciplinaController {
  async create(req, res) {
    try {
      const { curso_id } = req.params;
      const { nome, codigo } = req.body;

      const curso = await Curso.findByPk(curso_id);

      if (!curso) {
        return res.status(400).json({
          errors: 'Esse curso não existe.',
        });
      }

      const disciplina = await Disciplina.create({ curso_id, nome, codigo });

      const dados = {
        curso_id: curso.id,
        curso: curso.nome,
        id_disciplina: disciplina.id,
        disciplina: disciplina.nome,
      };

      return res.json(dados);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async getAll(req, res) {
    try {
      const disciplinas = await Disciplina.findAll({ attributes: ['id', 'nome'] });

      return res.json(disciplinas);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async getDisciplinesByCourse(req, res) {
    try {
      const { curso_id } = req.params;

      const curso = await Curso.findByPk(curso_id);

      if (!curso) {
        return res.status(400).json({
          errors: 'O curso não existe.',
        });
      }

      const disciplinas = await Disciplina.findAll({
        where: {
          curso_id,
        },
        attributes: ['id', 'nome'],
      });

      return res.json({ Curso: curso.nome, disciplinas });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async getDisciplineById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['O ID da disciplina não foi enviado.'],
        });
      }

      const disciplina = await Disciplina.findByPk(id);

      if (!disciplina) {
        return res.status(400).json({
          errors: ['Essa disciplina não existe.'],
        });
      }

      const { curso_id, nome } = disciplina;

      return res.json({ curso_id, id, nome });
    } catch (e) {
      return res.json(null);
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['O ID da disciplina não foi encontrado.'],
        });
      }

      const disciplina = await Disciplina.findByPk(req.params.id);

      if (!disciplina) {
        return res.status(400).json({
          errors: ['A disciplina procurada não existe.'],
        });
      }

      const { id, nome } = await disciplina.update(req.body);

      return res.json({ id, nome });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['O ID da disciplina não foi enviado.'],
        });
      }

      const disciplina = await Disciplina.findByPk(req.params.id);

      if (!disciplina) {
        return res.status(400).json({
          errors: ['A disciplina não existe.'],
        });
      }

      await disciplina.destroy();

      return res.json(`A disciplina '${disciplina.id} ${disciplina.nome}' foi deletada.`);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new DisciplinaController();
