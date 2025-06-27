import { Role } from '@/roles/domain/models/Role'

export class RoleMother {
  static createManyRealistic(): Role[] {
    return [
      {
        alias: 'admin',
        name: 'Admin',
        permissions: [
          'AddDataverse',
          'AddDataset',
          'ViewUnpublishedDataverse',
          'ViewUnpublishedDataset',
          'DownloadFile',
          'EditDataverse',
          'EditDataset',
          'ManageDataversePermissions',
          'ManageDatasetPermissions',
          'ManageFilePermissions',
          'PublishDataverse',
          'PublishDataset',
          'DeleteDataverse',
          'DeleteDatasetDraft'
        ],
        description:
          'A person who has all permissions for dataverses, datasets, and files, including approving requests for restricted data.',
        id: 1
      },
      {
        alias: 'fileDownloader',
        name: 'File Downloader',
        permissions: ['DownloadFile'],
        description: 'A person who can download a published file.',
        id: 2
      },
      {
        alias: 'fullContributor',
        name: 'Dataverse + Dataset Creator',
        permissions: ['AddDataverse', 'AddDataset'],
        description: 'A person who can add subdataverses and datasets within a dataverse.',
        id: 3
      },
      {
        alias: 'dvContributor',
        name: 'Dataverse Creator',
        permissions: ['AddDataverse'],
        description: 'A person who can add subdataverses within a dataverse.',
        id: 4
      },
      {
        alias: 'dsContributor',
        name: 'Dataset Creator',
        permissions: ['AddDataset'],
        description: 'A person who can add datasets within a dataverse.',
        id: 5
      },
      {
        alias: 'contributor',
        name: 'Contributor',
        permissions: [
          'ViewUnpublishedDataset',
          'DownloadFile',
          'EditDataset',
          'DeleteDatasetDraft'
        ],
        description:
          'For datasets, a person who can edit License + Terms, and then submit them for review.',
        id: 6
      },
      {
        alias: 'curator',
        name: 'Curator',
        permissions: [
          'AddDataverse',
          'AddDataset',
          'ViewUnpublishedDataverse',
          'ViewUnpublishedDataset',
          'DownloadFile',
          'EditDataset',
          'ManageDatasetPermissions',
          'ManageFilePermissions',
          'PublishDataset',
          'DeleteDatasetDraft'
        ],
        description:
          'For datasets, a person who can edit License + Terms, edit Permissions, and publish datasets.',
        id: 7
      },
      {
        alias: 'member',
        name: 'Member',
        permissions: ['ViewUnpublishedDataverse', 'ViewUnpublishedDataset', 'DownloadFile'],
        description: 'A person who can view both unpublished dataverses and datasets.',
        id: 8
      }
    ]
  }
}
