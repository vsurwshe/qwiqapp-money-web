import React from 'react'
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CreateProfile from '../src/secure/profiles/CreateProfile'

configure({adapter: new Adapter()})
describe('CreateProfile : ', () => {
  let profile;
  beforeEach(() => {
    profile = shallow(<CreateProfile />)
  });
it("", ()=>{
      expect(profile.exists()).toBe(true);
  })
})
