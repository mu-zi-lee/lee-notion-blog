import { useState, useEffect, useRef } from 'react'

/**
 * 翻译按钮组件
 * 与 translate.js 配合使用
 */
const TranslateButton = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentLang, setCurrentLang] = useState('原文')
    const [isReady, setIsReady] = useState(false)
    const dropdownRef = useRef(null)

    const languages = [
        { code: 'chinese_simplified', name: '简体中文' },
        { code: 'chinese_traditional', name: '繁體中文' },
        { code: 'english', name: 'English' },
        { code: 'japanese', name: '日本語' },
        { code: 'korean', name: '한국어' },
        { code: 'french', name: 'Français' },
        { code: 'german', name: 'Deutsch' },
        { code: 'spanish', name: 'Español' },
        { code: 'russian', name: 'Русский' }
    ]

    // 检查 translate.js 是否加载完成，并读取已保存的语言
    useEffect(() => {
        const checkTranslate = () => {
            if (typeof window !== 'undefined' && typeof window.translate !== 'undefined') {
                setIsReady(true)

                // 读取已保存的语言偏好
                const savedLang = localStorage.getItem('translate_lang')
                if (savedLang) {
                    const lang = languages.find(l => l.code === savedLang)
                    if (lang) {
                        setCurrentLang(lang.name)
                    }
                }
            }
        }

        // 立即检查一次
        checkTranslate()

        // 设置定时器定期检查
        const interval = setInterval(checkTranslate, 500)

        // 3秒后停止检查
        setTimeout(() => clearInterval(interval), 3000)

        return () => clearInterval(interval)
    }, [])

    // 点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleTranslate = (langCode, langName) => {
        if (typeof window !== 'undefined' && typeof window.translate !== 'undefined') {
            if (langCode === 'original') {
                // 恢复原文 - 清除所有缓存
                localStorage.removeItem('translate_lang')
                // 清除 translate.js 的缓存
                if (window.translate.language && window.translate.language.clearCacheLanguage) {
                    window.translate.language.clearCacheLanguage()
                }
                window.location.reload()
            } else {
                // 保存用户选择的语言
                localStorage.setItem('translate_lang', langCode)
                // 使用 changeLanguage 切换语言（这是正确的 API）
                window.translate.changeLanguage(langCode)
                setCurrentLang(langName)
            }
        } else {
            console.warn('translate.js 尚未加载完成')
        }
        setIsOpen(false)
    }

    return (
        <div className={`${className || ''} relative`} ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1 cursor-pointer hover:scale-110 transform duration-200 dark:text-gray-200 text-gray-800 ${!isReady ? 'opacity-50' : ''}`}
                title={isReady ? '翻译页面' : '翻译功能加载中...'}
            >
                {/* 翻译图标 */}
                <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
                    />
                </svg>
            </div>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className='absolute bottom-full mb-2 right-0 min-w-[120px] bg-white dark:bg-[#232222] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50'>
                    {/* 恢复原文选项 */}
                    <div
                        onClick={() => handleTranslate('original', '原文')}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${currentLang === '原文' ? 'font-bold text-[var(--primary-color)] dark:text-white' : ''}`}
                    >
                        原文
                    </div>
                    <div className='border-t border-gray-100 dark:border-gray-700 my-1'></div>
                    {/* 语言列表 */}
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            onClick={() => handleTranslate(lang.code, lang.name)}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${currentLang === lang.name ? 'font-bold text-[var(--primary-color)] dark:text-white' : ''}`}
                        >
                            {lang.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TranslateButton
