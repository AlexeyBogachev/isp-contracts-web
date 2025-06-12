import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SidebarMenu.module.css';
import {
    FaHome,
    FaClipboardList,
    FaHistory,
    FaUserPlus,
    FaFileContract,
    FaBuilding,
    FaUser,
    FaUsers,
    FaSignOutAlt,
    FaBars,
    FaChevronDown,
    FaFileAlt,
    FaFileSignature
} from 'react-icons/fa';

const MenuItem = ({ icon, label, to, onClick, delay, isLogout, hasSubItems, isExpanded, isActive, onToggle, children }) => {
    const handleClick = (e) => {
        if (hasSubItems) {
            e.preventDefault();
            onToggle();
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`${styles.menuItem} 
                ${isLogout ? styles.logoutItem : ''} 
                ${hasSubItems ? styles.hasSubItems : ''}`}
            style={{ '--delay': `${delay}s` }}
        >
            <Link
                to={to}
                onClick={handleClick}
                className={`${styles.menuLink} ${hasSubItems ? styles.parentLink : ''}`}
            >
                <div className={styles.iconWrapper}>
                    {icon}
                </div>
                <span className={styles.menuText}>{label}</span>
                {hasSubItems && (
                    <div className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
                        <FaChevronDown />
                    </div>
                )}
            </Link>
            {hasSubItems && (
                <div className={`${styles.subItems} ${isExpanded ? styles.expanded : ''}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

const SidebarMenu = ({ isOpen, setIsOpen, handleLogout }) => {
    const [expandedCategories, setExpandedCategories] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => {
            const newState = { ...prev };
            const [parentId, childId] = categoryId.split('.');

            if (childId) {
                const isCurrentlyExpanded = prev[categoryId];
                if (!isCurrentlyExpanded) {
                    Object.keys(prev).forEach(key => {
                        if (key.startsWith(`${parentId}.`) && key !== categoryId) {
                            newState[key] = false;
                        }
                    });
                    newState[parentId] = true;
                }
                newState[categoryId] = !isCurrentlyExpanded;
            } else {
                const isCurrentlyExpanded = prev[categoryId];
                if (!isCurrentlyExpanded) {
                    Object.keys(prev).forEach(key => {
                        if (!key.includes('.') && key !== categoryId) {
                            newState[key] = false;
                            Object.keys(prev).forEach(subKey => {
                                if (subKey.startsWith(`${key}.`)) {
                                    newState[subKey] = false;
                                }
                            });
                        }
                    });
                } else {
                    Object.keys(prev).forEach(key => {
                        if (key.startsWith(`${categoryId}.`)) {
                            newState[key] = false;
                        }
                    });
                }
                newState[categoryId] = !isCurrentlyExpanded;
            }
            return newState;
        });
        setActiveCategory(categoryId);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => {
                setExpandedCategories({});
                setActiveCategory(null);
            }, 300);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const menuStructure = [
        {
            id: 'home',
            to: '/menu',
            label: 'Главная',
            icon: <FaHome size={24} />
        },
        {
            id: 'applications',
            label: 'Заявки',
            icon: <FaClipboardList size={24} />,
            subItems: [
                {
                    to: '/new-applications',
                    label: 'Новые заявки',
                    icon: <FaFileAlt size={20} />
                },
                {
                    to: '/history-applications',
                    label: 'История заявок',
                    icon: <FaHistory size={20} />
                },
                {
                    id: 'applications.create',
                    label: 'Создание заявки',
                    icon: <FaFileSignature size={20} />,
                    subItems: [
                        {
                            to: '/user-registration',
                            label: 'Регистрация пользователя',
                            icon: <FaUserPlus size={18} />
                        },
                        {
                            to: '/create-application',
                            label: 'Оформление пользователя',
                            icon: <FaFileContract size={18} />
                        }
                    ]
                }
            ]
        },
        {
            id: 'contracts',
            label: 'Договора',
            icon: <FaFileContract size={24} />,
            subItems: [
                {
                    to: '/contract-management-legal-entities',
                    label: 'Договора юридических лиц',
                    icon: <FaBuilding size={20} />
                },
                {
                    to: '/contract-management-natural-persons',
                    label: 'Договора физических лиц',
                    icon: <FaUser size={20} />
                }
            ]
        },
        {
            id: 'users',
            to: '/view-users',
            label: 'Пользователи',
            icon: <FaUsers size={24} />
        }
    ];

    const renderMenuItem = (item, depth = 0, parentId = '') => {
        const delay = 0.1 + depth * 0.05;
        const fullId = parentId ? `${parentId}.${item.id}` : item.id;
        const isExpanded = expandedCategories[fullId];
        const isActive = activeCategory === fullId;

        if (item.subItems) {
            return (
                <MenuItem
                    key={fullId}
                    icon={item.icon}
                    label={item.label}
                    to={item.to || '#'}
                    delay={delay}
                    hasSubItems={true}
                    isExpanded={isExpanded}
                    isActive={isActive}
                    onToggle={() => toggleCategory(fullId)}
                >
                    {item.subItems.map(subItem => renderMenuItem(subItem, depth + 1, item.id))}
                </MenuItem>
            );
        }

        return (
            <MenuItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                onClick={() => {
                    setIsOpen(false);
                    setActiveCategory(null);
                }}
                delay={delay}
            />
        );
    };

    return (
        <>
            <button
                className={`${styles.menuToggle} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <FaBars size={24} />
            </button>

            <div
                className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
            />

            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.sidebarContent}>
                    <div className={styles.menuHeader}>
                        <h2>Меню</h2>
                        <div className={styles.headerDecoration} />
                    </div>

                    <div className={styles.menuItems}>
                        {menuStructure.map(item => renderMenuItem(item))}
                    </div>

                    <MenuItem
                        icon={<FaSignOutAlt size={24} />}
                        label="Выйти"
                        to="#"
                        onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                        }}
                        delay={0.1 + menuStructure.length * 0.05}
                        isLogout
                    />
                </div>
            </div>
        </>
    );
};

export default SidebarMenu; 