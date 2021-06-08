const User = require('../models/User')
const Program = require('../models/Program')
const Organization = require('../models/Organization')
const Group = require('../models/Group')
const Edudirection = require('../models/Edudirection')
const Result = require('../models/Result')

const mapSelectedUsers = async (users) =>
  await Promise.all(
    users.map(async (user) => {
      const userFind = await User.findById(
        user,
        '_id lastname firstname patronymic'
      )
      return {
        value: userFind ? userFind._id : 'Пользователь удален',
        label: userFind
          ? userFind.lastname +
            ' ' +
            userFind.firstname +
            ' ' +
            userFind.patronymic
          : 'Пользователь удален',
      }
    })
  )

const mapSelectedUsersWithResult = async (users, programs, group) => {
  const result = []
  await Promise.all(
    users.map(async (user) => {
      const userToFind = await User.findById(user, '_id fullname')
      return await Promise.all(
        programs.map(async (program) => {
          const resultToFind = await Result.findOne(
            { user, program, group },
            'passed attempt'
          ).sort({
            _id: -1,
          })

          const programToFind = await Program.findById(program, '_id name')

          return result.push({
            userId: userToFind._id,
            name: userToFind.fullname,
            programId: programToFind._id,
            program: programToFind.name,
            passed: resultToFind.passed,
            attempt: resultToFind.attempt,
          })
        })
      )
    })
  )
  return result
}

const mapSelectedPrograms = async (programs) =>
  await Promise.all(
    programs.map(async (program) => {
      const programFind = await Program.findById(program, '_id name')
      return {
        value: programFind ? programFind._id : 'Программа удалена',
        label: programFind ? programFind.name : 'Программа удалена',
      }
    })
  )

const mapSelectedProgramsAndEdudir = async (programs) =>
  await Promise.all(
    programs.map(async (program) => {
      const programFind = await Program.findById(
        program,
        '_id name edudirection'
      )
      const edudirectionFind = await Edudirection.findById(
        programFind.edudirection,
        '_id name'
      )
      return {
        value: programFind ? programFind._id : 'Программа удалена',
        label: programFind ? programFind.name : 'Программа удалена',
        valueEdudirection: edudirectionFind
          ? edudirectionFind._id
          : 'Направление обучения удалено',
        labelEdudirection: edudirectionFind
          ? edudirectionFind.name
          : 'Направление обучения удалено',
      }
    })
  )

const mapSelectedOrganizations = async (organizations) =>
  await Promise.all(
    organizations.map(async (organization) => {
      const organizationFind = await Organization.findById(
        organization,
        '_id name'
      )
      return {
        value: organizationFind ? organizationFind._id : 'Организация удалена',
        label: organizationFind ? organizationFind.name : 'Организация удалена',
      }
    })
  )

const mapSelectedGroups = async (groups) =>
  await Promise.all(
    groups.map(async (group) => {
      const groupFind = await Group.findById(group, '_id name')
      return {
        value: groupFind ? groupFind._id : 'Группа удалена',
        label: groupFind ? groupFind.name : 'Группа удалена',
      }
    })
  )

const mapUsers = (users) =>
  users.reverse().map((user) => {
    return {
      value: user._id,
      label: user.lastname + ' ' + user.firstname + ' ' + user.patronymic,
    }
  })

const mapPrograms = (programs) =>
  programs.reverse().map((program) => {
    return {
      value: program._id,
      label: program.name,
    }
  })

module.exports = {
  mapSelectedUsers,
  mapSelectedUsersWithResult,
  mapSelectedPrograms,
  mapSelectedProgramsAndEdudir,
  mapSelectedOrganizations,
  mapUsers,
  mapPrograms,
  mapSelectedGroups,
}
