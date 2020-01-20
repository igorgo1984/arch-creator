package lib

func (i *config) GetOwnCloudPassword() *string {
	return &i.OwnCloudPassword
}

func (i *config) GetOwnCloudLogin() *string {
	return &i.OwnCloudLogin
}

func (i *config) GetOwnCloudUri() *string {
	return &i.OwnCloudUri
}
