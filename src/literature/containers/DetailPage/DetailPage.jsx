import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { Map, List } from 'immutable';

import './DetailPage.scss';
import {
  fetchLiterature,
  fetchLiteratureReferences,
} from '../../../actions/literature';
import ArxivEprintList from '../../components/ArxivEprintList';
import AuthorList from '../../components/AuthorList';
import ArxivPdfDownloadAction from '../../components/ArxivPdfDownloadAction';
import CiteModalAction from '../../components/CiteModalAction';
import DOIList from '../../components/DOIList';
import CollaborationList from '../../components/CollaborationList';
import ExternalSystemIdentifierList from '../../components/ExternalSystemIdentifierList';
import Latex from '../../../common/components/Latex';
import ContentBox from '../../../common/components/ContentBox';
import LiteratureDate from '../../components/LiteratureDate';
import LiteratureKeywordList from '../../components/LiteratureKeywordList';
import PublicationInfoList from '../../components/PublicationInfoList';
import ReferenceList from '../../components/ReferenceList';
import ReportNumberList from '../../components/ReportNumberList';

class DetailPage extends Component {
  componentWillMount() {
    const recordId = this.props.match.params.id;
    this.props.dispatch(fetchLiterature(recordId));
    this.props.dispatch(fetchLiteratureReferences(recordId));
  }

  render() {
    const { references, loadingReferences } = this.props;

    const { record } = this.props;
    const metadata = record.get('metadata');
    if (!metadata) {
      return null;
    }

    const title = metadata.getIn(['titles', 0, 'title']);
    const authors = metadata.get('authors');
    const date = metadata.get('date');
    const recordId = metadata.get('control_number');
    const publicationInfo = metadata.get('publication_info');
    const eprints = metadata.get('arxiv_eprints');
    const dois = metadata.get('dois');
    const reportNumbers = metadata.get('report_numbers');
    const externalSystemIdentifiers = metadata.get(
      'external_system_identifiers'
    );

    const abstract = metadata.getIn(['abstracts', 0, 'value']);
    const arxivId = metadata.getIn(['arxiv_eprints', 0, 'value']);
    const collaborations = metadata.get('collaborations');

    const keywords = metadata.get('keywords');

    return (
      <Row className="__DetailPage__" type="flex" justify="center">
        <Col className="mt3 mb3" span={14}>
          <ContentBox
            loading={this.props.loading}
            actions={[
              arxivId && <ArxivPdfDownloadAction arxivId={arxivId} />,
              <CiteModalAction recordId={recordId} />,
            ].filter(action => action != null)}
          >
            <h2>
              <Latex>{title}</Latex>
            </h2>
            <div>
              <CollaborationList
                wrapperClassName="di pr1"
                collaborations={collaborations}
              />
              <AuthorList
                wrapperClassName="di"
                recordId={recordId}
                authors={authors}
              />
            </div>
            <LiteratureDate date={date} />
            <div className="mt3">
              <PublicationInfoList publicationInfo={publicationInfo} />
              <ArxivEprintList eprints={eprints} />
              <DOIList dois={dois} />
              <ReportNumberList reportNumbers={reportNumbers} />
              <ExternalSystemIdentifierList
                externalSystemIdentifiers={externalSystemIdentifiers}
              />
            </div>
            <Row>
              <div className="mt3">
                <Latex>{abstract}</Latex>
              </div>
            </Row>
            <Row>
              <div className="mt3">
                <LiteratureKeywordList keywords={keywords} />
              </div>
            </Row>
          </ContentBox>
        </Col>
        <Col className="mt3 mb3" span={14}>
          <ContentBox
            title={`References (${references.size})`}
            loading={loadingReferences}
          >
            <ReferenceList
              references={references}
              loading={loadingReferences}
            />
          </ContentBox>
        </Col>
      </Row>
    );
  }
}

DetailPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  record: PropTypes.instanceOf(Map).isRequired,
  references: PropTypes.instanceOf(List).isRequired,
  loadingReferences: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loading: state.literature.get('loading'),
  record: state.literature.get('data'),
  references: state.literature.get('references'),
  loadingReferences: state.literature.get('loadingReferences'),
});
const dispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, dispatchToProps)(DetailPage);
