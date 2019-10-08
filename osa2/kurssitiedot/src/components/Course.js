import React from 'react'

const Course = ({ course }) => {
   return (
      <>
         <Header header={course.name} />
         <Content parts={course.parts} />
         <Total parts={course.parts} />
      </>
   )
}

const Header = (props) => {
   return (
      <h2>{props.header}</h2>
   )
}

const Content = ({ parts }) => (
   parts.map(part =>
      <Part part={part} key={part.id} />
   )
)

const Part = ({ part }) => {
   return (
      <p>{part.name + ' ' + part.exercises}</p>
   )
}

const Total = ({ parts }) => {
   const exerciseNumbers = parts.map(part => part.exercises)

   let sum = exerciseNumbers.reduce((s, value) => s + value)

   return (
      <p style={{fontWeight: 'bold'}}>Total of {sum} exercises</p>
   )
}

export default Course