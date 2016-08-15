import * as React from 'react'
import List from '../list'
import { Dispatcher } from '../../lib/dispatcher'
import Repository from '../../models/repository'
import { Branch } from '../../lib/local-git-operations'
import { groupedBranches, BranchListItem } from './grouped-branches'

const RowHeight = 25

interface IBranchesProps {
  readonly defaultBranch: Branch | null
  readonly currentBranch: Branch | null
  readonly allBranches: ReadonlyArray<Branch>
  readonly recentBranches: ReadonlyArray<Branch>
  readonly dispatcher: Dispatcher
  readonly repository: Repository
}

export default class Branches extends React.Component<IBranchesProps, void> {
  public componentDidMount() {
    this.props.dispatcher.loadBranches(this.props.repository)
  }

  private renderRow(branchItems: ReadonlyArray<BranchListItem>, row: number) {
    const item = branchItems[row]
    if (item.kind === 'branch') {
      const branch = item.branch
      return <div className='branches-list-content branches-list-item'>{branch.name}</div>
    } else {
      return <div className='branches-list-content branches-list-label'>{item.label}</div>
    }
  }

  private onSelectionChanged(branchItems: ReadonlyArray<BranchListItem>, row: number) {
    const item = branchItems[row]
    if (item.kind !== 'branch') { return }

    const branch = item.branch
    this.props.dispatcher.closePopup()
    this.props.dispatcher.checkoutBranch(this.props.repository, branch.name)
  }

  public render() {
    const branchItems = groupedBranches(this.props.defaultBranch, this.props.currentBranch, this.props.allBranches, this.props.recentBranches)
    return (
      <div id='branches' className='panel branches-popup'>
        <List rowCount={branchItems.length}
              rowRenderer={row => this.renderRow(branchItems, row)}
              rowHeight={RowHeight}
              selectedRow={-1}
              onSelectionChanged={row => this.onSelectionChanged(branchItems, row)}/>
      </div>
    )
  }
}
