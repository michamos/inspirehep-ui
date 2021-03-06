import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import PublicationInfoList from '../PublicationInfoList';

describe('PublicationInfoList', () => {
  it('renders with publicationInfo', () => {
    const publicationInfo = fromJS([
      {
        journal_title: 'Test Journal',
      },
    ]);
    const wrapper = shallow((
      <PublicationInfoList publicationInfo={publicationInfo} />
    ));
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
