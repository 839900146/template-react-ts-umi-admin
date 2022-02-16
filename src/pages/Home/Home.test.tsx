// @ts-ignore
import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';

describe('首页模块', () => {
  it('渲染内容测试', () => {
    const app = shallow(<Home />);
    const text = app.find('h1').text();
    expect(text).toEqual('这是首页');
  });
});
