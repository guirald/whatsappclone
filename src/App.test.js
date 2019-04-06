import React from 'react'
import App from './App'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

it("should render the FormLogin for the non logged in user", () => {
    const app = mount (<App />)
    expect(toJson(app)).toMatchSnapshot()
})