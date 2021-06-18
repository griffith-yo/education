const User = require('../models/User')
const Program = require('../models/Program')
const Organization = require('../models/Organization')
const Group = require('../models/Group')
const Edudirection = require('../models/Edudirection')
const Result = require('../models/Result')

const mapSelectedUsers = async (users) => {
  const selectedUsers = await Promise.all(
    users.map(async (user) => {
      const userFind = await User.findById(user, '_id fullname')
      if (userFind)
        return {
          value: userFind._id,
          label: userFind.fullname,
        }
    })
  )
  return selectedUsers.filter(Boolean)
}

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

          if (userToFind)
            return result.push({
              userId: userToFind._id,
              name: userToFind.fullname,
              programId: programToFind._id,
              program: programToFind.name,
              passed: resultToFind.passed,
              attempt: resultToFind.attempt,
            })
          else
            return result.push({
              userId: '',
              name: 'Пользователь удален',
              programId: programToFind._id,
              program: programToFind.name,
              passed: '',
              attempt: '',
            })
        })
      )
    })
  )
  return result
}

const mapSelectedPrograms = async (programs) => {
  const selectedPrograms = await Promise.all(
    programs.map(async (program) => {
      const programFind = await Program.findById(program, '_id name')
      return {
        value: programFind._id,
        label: programFind.name,
      }
    })
  )
  return selectedPrograms.filter(Boolean)
}

const mapSelectedProgramsAndEdudir = async (programs) => {
  const selectedProgramsAndEdudir = await Promise.all(
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
        value: programFind._id,
        label: programFind.name,
        valueEdudirection: edudirectionFind._id,
        labelEdudirection: edudirectionFind,
      }
    })
  )
  return selectedProgramsAndEdudir.filter(Boolean)
}

const mapSelectedOrganizations = async (organizations) => {
  const selectedOrganizations = await Promise.all(
    organizations.map(async (organization) => {
      const organizationFind = await Organization.findById(
        organization,
        '_id name'
      )
      return {
        value: organizationFind._id,
        label: organizationFind.name,
      }
    })
  )
  return selectedOrganizations.filter(Boolean)
}

const mapSelectedGroups = async (groups) => {
  const selectedGroups = await Promise.all(
    groups.map(async (group) => {
      const groupFind = await Group.findById(group, '_id name')
      if (groupFind)
        return {
          value: groupFind._id,
          label: groupFind.name,
        }
    })
  )
  return selectedGroups.filter(Boolean)
}

const mapUsers = (users) =>
  users.reverse().map((user) => {
    return {
      value: user._id,
      label: user.fullname,
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
