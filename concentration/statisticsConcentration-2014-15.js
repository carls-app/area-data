import _ from 'lodash'

import hasDepartment from 'sto-helpers/lib/hasDepartment'
import checkCoursesFor from 'sto-helpers/lib/checkCoursesFor'

function foundationCourses(courses) {
	/* Foundation courses:
		- one of Computer Science 121 or 125;
		- Computer Science 241, 251, and 252;
		- one of Computer Science 231 or Math 232 or Math 252.
	*/

	let requirements = [
		{title: 'STAT 110', result: checkCoursesFor(courses, {deptnum:'STAT 110'})},
		{title: 'STAT 212', result: checkCoursesFor(courses, {deptnum:'STAT 212'})},
		{title: 'STAT 214', result: checkCoursesFor(courses, {deptnum:'STAT 214'})},
		{title: 'STAT 263', result: checkCoursesFor(courses, {deptnum:'STAT 263'})},
	]

	return {
		title: 'Foundation',
		description: 'These are recommended courses for the concentration.',
		result: true,
		type: 'array/some',
		details: {
			from: requirements,
			has: _(requirements).pluck('result').compact().size(),
			needs: 'any number',
		},
	}
}

function coreCourses(courses) {
	/* The Two (2) Core Courses:
		- Statistics 272: Statistical Modeling
		- Statistics 316: Advanced Statistical Modeling
	*/

	let statisticalModeling = checkCoursesFor(courses, {deptnum:'STAT 272'})
	let advancedModeling = checkCoursesFor(courses, {deptnum:'STAT 316'})

	let requirements = [
		{
			title: 'Statistical Modeling',
			result: statisticalModeling,
		},
		{
			title: 'Advanced Modeling',
			result: advancedModeling,
		},
	]

	return {
		title: 'Core',
		type: 'array/boolean',
		description: 'Statistics 272: Statistical Modeling, and Statistics 316: Advanced Statistical Modeling',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

	let validElectives = [
		{title: 'CSCI 125', result: checkCoursesFor(courses, {deptnum:'CSCI 125'})},
		{title: 'ECON 385', result: checkCoursesFor(courses, {deptnum:'ECON 385'})},
		{title: 'MATH 262', result: checkCoursesFor(courses, {deptnum:'MATH 262'})},
		{title: 'PSYCH 230', result: checkCoursesFor(courses, {deptnum:'PSYCH 230'})},
		{title: 'SOAN 371', result: checkCoursesFor(courses, {deptnum:'SOAN 371'})},
		{title: 'STAT 270', result: checkCoursesFor(courses, {deptnum:'STAT 270'})},
		{title: 'STAT 282', result: checkCoursesFor(courses, {deptnum:'STAT 282'})},
		{title: 'STAT 322', result: checkCoursesFor(courses, {deptnum:'STAT 322'})},
	]

	let numberTaken = _(validElectives)
		.pluck('result')
		.compact()
		.size()
	let numberNeeded = 2

	return {
		title: 'Electives',
		type: 'array/some',
		description: 'Two electives.',
		result: numberTaken >= numberNeeded,
		details: {
			needs: numberNeeded,
			has: numberTaken,
			from: validElectives,
		},
	}
}

function checkStatisticsConcentration(studentData) {
	return studentData.then((studentPieces) => {
		let {courses} = studentPieces

		let statisticsConcentrationRequirements = [
			foundationCourses(courses),
			coreCourses(courses),
			electiveCourses(courses),
		]

		return {
			result: _.all(statisticsConcentrationRequirements, 'result'),
			details: statisticsConcentrationRequirements,
		}
	})
}

let statisticsConcentration = {
	title: 'Statistics',
	type: 'concentration',
	id: 'c-stat',
	departmentAbbr: 'STAT',
	revisionYear: 2014,

	check: checkStatisticsConcentration,
	_requirements: {
		foundationCourses,
		coreCourses,
		electiveCourses,
	},
}

export default statisticsConcentration