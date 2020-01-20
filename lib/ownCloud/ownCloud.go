package main

type ConfigInterface interface {
	GetOwnCloudPassword() *string
	GetOwnCloudLogin() *string
	GetOwnCloudUri() *string
}
